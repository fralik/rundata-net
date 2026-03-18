"""Data migration: extract runer.ku.dk URLs from reference texts.

For every Reference whose text contains the pattern
    ``(optional $=)DK nr.: <id>, http://runer.ku.dk/<path>``
the segment is removed from the text reference, and a dedicated *link*
Reference is created (kind='link', label='Runedatabasen Danske
Runeindskrifter', text=<url>).  That link reference is then associated
with every MetaInformation that previously held the original text
reference.

If all content is removed from a text reference it is deleted from the
database.  If the cleaned text collides with an already-existing
Reference, the MetaInformation associations are transferred to the
existing object and the duplicate is removed.
"""

import re

from django.db import migrations

# Separator used between individual items in the legacy concatenated
# reference text field.
_SEPARATOR = "; "

# Matches a single segment (after splitting on _SEPARATOR) that
# contains a Danish runic database entry, e.g.
#   "DK nr.: Sk 130, http://runer.ku.dk/VisGenstand.aspx?Titel=F%c3%a4rl%c3%b6v-sten"
#   "$=DK nr.: Bh 26, http://runer.ku.dk/VisGenstand.aspx?Titel=Sandeg%C3%A5rd-blyamulet"
# Group 1 captures the runer.ku.dk URL.
_DK_SEGMENT_RE = re.compile(
    r"^(?:\$=)?DK nr\.: [^,]+, (http://runer\.ku\.dk/.+)$",
)

_LABEL = "Danish Runic Inscriptions Database"


def extract_dk_references(apps, schema_editor):
    Reference = apps.get_model("runes", "Reference")

    # Work on a snapshot of matching PKs so we don't modify the queryset
    # while iterating.
    matching_pks = list(Reference.objects.filter(text__icontains="DK nr.:").values_list("pk", flat=True))

    stats = {
        "refs_processed": 0,
        "links_created": 0,
        "links_reused": 0,
        "refs_deleted": 0,
        "refs_merged": 0,
        "refs_updated": 0,
    }

    for pk in matching_pks:
        try:
            ref = Reference.objects.get(pk=pk)
        except Reference.DoesNotExist:
            # May have been deleted in a previous iteration (merge branch).
            continue

        segments = ref.text.split(_SEPARATOR)
        keep_segments = []
        extracted_urls = []

        for seg in segments:
            m = _DK_SEGMENT_RE.match(seg)
            if m:
                extracted_urls.append(m.group(1))
            else:
                keep_segments.append(seg)

        if not extracted_urls:
            # Pattern not actually present in any segment.
            continue

        stats["refs_processed"] += 1

        # Collect affected MetaInformation objects *before* modifying
        # the reference so the M2M relationship is still intact.
        meta_informations = list(ref.meta_informations.all())

        # --- Create / retrieve link references and associate them --------
        for url in extracted_urls:
            link_ref, created = Reference.objects.get_or_create(
                text=url,
                defaults={"kind": "link", "label": _LABEL},
            )
            if created:
                stats["links_created"] += 1
            else:
                stats["links_reused"] += 1
            if not created and not link_ref.label:
                # Pre-existing bare-URL reference – give it a proper label.
                link_ref.kind = "link"
                link_ref.label = _LABEL
                link_ref.save()
            for meta in meta_informations:
                meta.references.add(link_ref)

        # --- Update / delete the original text reference -----------------
        new_text = _SEPARATOR.join(keep_segments)

        if not new_text:
            # All content was extracted – remove and delete the reference.
            for meta in meta_informations:
                meta.references.remove(ref)
            ref.delete()
            stats["refs_deleted"] += 1
        else:
            # Check whether the cleaned text already exists as a Reference.
            existing = Reference.objects.filter(text=new_text).exclude(pk=ref.pk).first()
            if existing:
                # Transfer associations to the existing reference and drop
                # the now-duplicate original.
                for meta in meta_informations:
                    meta.references.add(existing)
                    meta.references.remove(ref)
                ref.delete()
                stats["refs_merged"] += 1
            else:
                ref.text = new_text
                ref.save()
                stats["refs_updated"] += 1

    print(
        f"\n  DK references migration: "
        f"{stats['refs_processed']} processed, "
        f"{stats['links_created']} links created, "
        f"{stats['links_reused']} links reused, "
        f"{stats['refs_updated']} updated, "
        f"{stats['refs_merged']} merged, "
        f"{stats['refs_deleted']} deleted"
    )


class Migration(migrations.Migration):

    dependencies = [
        ("runes", "0005_add_references_to_all_data_view"),
    ]

    operations = [
        migrations.RunPython(extract_dk_references, migrations.RunPython.noop),
    ]
