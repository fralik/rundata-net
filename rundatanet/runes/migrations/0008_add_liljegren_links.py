"""Data migration: add Liljegren Runurkunder page links to L-inscriptions.

Reads ``Liljegren_Runurkunder_L_signatures_page_links.csv`` (co-located
in this migrations folder) and for each row creates or updates a
``kind='link'`` Reference pointing to the litteraturbanken.se faksimil
page, labelled ``Liljegren, page <page>``. The reference is then
associated with the ``MetaInformation`` record whose signature matches
the ``Id number`` column.

Multiple inscriptions may share the same URL (page), so the migration
reuses a single Reference for shared URLs/pages instead of creating
duplicates.
"""

import csv
import logging
import os
import re

from django.db import migrations

logger = logging.getLogger(__name__)

_CSV_FILE = os.path.join(
    os.path.dirname(__file__),
    "Liljegren_Runurkunder_L_signatures_page_links.csv",
)

_PAGE_RE = re.compile(r"/sida/(\d+)/faksimil")


def _read_csv():
    """Yield (inscription_id, url, page_or_None) tuples from the CSV file.

    ``page_or_None`` is ``None`` when the URL does not match the expected
    ``/sida/<page>/faksimil`` shape; callers are expected to treat such
    rows as skipped so malformed data is visible in migration output.
    """
    with open(_CSV_FILE, newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            inscription_id = row["Id number"]
            url = row["Link"]
            m = _PAGE_RE.search(url)
            page = m.group(1) if m else None
            yield inscription_id, url, page


def add_liljegren_links(apps, schema_editor):
    Signature = apps.get_model("runes", "Signature")
    MetaInformation = apps.get_model("runes", "MetaInformation")
    Reference = apps.get_model("runes", "Reference")

    db_alias = schema_editor.connection.alias

    added = 0
    skipped = 0

    for inscription_id, url, page in _read_csv():
        if page is None:
            skipped += 1
            logger.warning(
                "malformed Liljegren URL for inscription '%s': %s – skipped",
                inscription_id,
                url,
            )
            continue

        label = f"Liljegren, page {page}"

        try:
            sig = Signature.objects.using(db_alias).get(
                signature_text=inscription_id,
            )
        except Signature.DoesNotExist:
            skipped += 1
            logger.warning("inscription '%s' not found – skipped", inscription_id)
            continue

        lookup_sig = sig
        if sig.parent_id:
            lookup_sig = Signature.objects.using(db_alias).get(pk=sig.parent_id)

        try:
            meta = MetaInformation.objects.using(db_alias).get(signature=lookup_sig)
        except MetaInformation.DoesNotExist:
            skipped += 1
            logger.warning("MetaInformation for '%s' not found – skipped", inscription_id)
            continue

        ref, _ = Reference.objects.using(db_alias).update_or_create(
            text=url,
            defaults={"kind": "link", "label": label},
        )
        meta.references.add(ref)
        added += 1

    logger.info("Liljegren links: %d added, %d skipped", added, skipped)


def reverse_liljegren_links(apps, schema_editor):
    MetaInformation = apps.get_model("runes", "MetaInformation")
    Signature = apps.get_model("runes", "Signature")
    Reference = apps.get_model("runes", "Reference")

    db_alias = schema_editor.connection.alias

    removed = 0

    for inscription_id, url, page in _read_csv():
        if page is None:
            continue
        try:
            ref = Reference.objects.using(db_alias).get(text=url)
        except Reference.DoesNotExist:
            continue

        try:
            sig = Signature.objects.using(db_alias).get(
                signature_text=inscription_id,
            )
            lookup_sig = sig
            if sig.parent_id:
                lookup_sig = Signature.objects.using(db_alias).get(pk=sig.parent_id)
            meta = MetaInformation.objects.using(db_alias).get(signature=lookup_sig)
            meta.references.remove(ref)
        except (Signature.DoesNotExist, MetaInformation.DoesNotExist):
            pass

        if not ref.meta_informations.exists():
            ref.delete()
            removed += 1

    logger.info("Liljegren links reverse: %d references deleted", removed)


class Migration(migrations.Migration):

    dependencies = [
        ("runes", "0007_add_bautil_links"),
    ]

    operations = [
        migrations.RunPython(add_liljegren_links, reverse_liljegren_links),
    ]
