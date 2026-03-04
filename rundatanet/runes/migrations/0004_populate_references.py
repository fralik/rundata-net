"""Data migration: populate Reference objects from legacy ``reference`` field,
add a Riksarkivet link for every inscription, and add ``kind``/``label`` fields."""

import urllib.parse

from django.db import migrations


def _build_riksarkivet_link(inscription_id: str) -> str:
    """Return a URL linking to the Riksarkivet DocList for *inscription_id*."""
    quoted_id = urllib.parse.quote(inscription_id)
    url = f"https://riksarkivet.x-ref.se/DocList?find=RUNSIG%20%22{quoted_id}%22"
    return url


def populate_references(apps, schema_editor):
    MetaInformation = apps.get_model("runes", "MetaInformation")
    Reference = apps.get_model("runes", "Reference")

    # Phase 1 – copy every non-empty legacy ``reference`` text field as-is
    for meta in MetaInformation.objects.exclude(reference="").select_related("signature"):
        ref_obj, _ = Reference.objects.get_or_create(text=meta.reference)
        meta.references.add(ref_obj)

    # Phase 2 – add a Riksarkivet link for every inscription
    for meta in MetaInformation.objects.select_related("signature").all():
        link_url = _build_riksarkivet_link(meta.signature.signature_text)
        ref_obj, _ = Reference.objects.get_or_create(text=link_url, defaults={"kind": "link", "label": "Riksarkivet"})
        meta.references.add(ref_obj)


def reverse_populate(apps, schema_editor):
    MetaInformation = apps.get_model("runes", "MetaInformation")
    Reference = apps.get_model("runes", "Reference")

    # Remove all M2M associations, then delete all Reference rows
    for meta in MetaInformation.objects.all():
        meta.references.clear()
    Reference.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("runes", "0003_metawithcrossestextual_reference_and_more"),
    ]

    operations = [
        migrations.RunPython(populate_references, reverse_populate),
    ]
