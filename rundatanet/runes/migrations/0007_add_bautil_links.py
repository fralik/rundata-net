"""Data migration: add Bautil / Alvin-portal links to B-inscriptions.

Reads ``B_to_Bautil_links.csv`` (co-located in this migrations folder) and
for each row creates a ``kind='link'`` Reference pointing to the Alvin
image viewer, labelled ``Bautil-<page>``.  The reference is then associated
with the ``MetaInformation`` record whose signature matches the
``inscription_id`` column.

Multiple inscriptions may share the same ``dsId`` (and therefore the same
URL), so ``get_or_create`` is used to avoid duplicates.
"""

import csv
import os

from django.db import migrations

_URL_TEMPLATE = (
    "https://www.alvin-portal.org/alvin/imageViewer.jsf" "?dsId={ds_id}&pid=alvin-record%3A181160&dswid=2764"
)

_CSV_FILE = os.path.join(os.path.dirname(__file__), "B_to_Bautil_links.csv")


def _read_csv():
    """Yield (inscription_id, ds_id, page) tuples from the CSV file."""
    with open(_CSV_FILE, newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            yield row["inscription_id"], row["dsId"], row["page"]


def add_bautil_links(apps, schema_editor):
    Signature = apps.get_model("runes", "Signature")
    MetaInformation = apps.get_model("runes", "MetaInformation")
    Reference = apps.get_model("runes", "Reference")

    db_alias = schema_editor.connection.alias

    added = 0
    skipped = 0

    for inscription_id, ds_id, page in _read_csv():
        url = _URL_TEMPLATE.format(ds_id=ds_id)
        label = f"Bautil-{page}"

        try:
            sig = Signature.objects.using(db_alias).get(
                signature_text=inscription_id,
            )
        except Signature.DoesNotExist:
            skipped += 1
            print(f"  WARNING: inscription '{inscription_id}' not found – skipped")
            continue

        # MetaInformation may live on the parent signature (B inscriptions
        # are typically aliases).
        lookup_sig = sig
        if sig.parent_id:
            lookup_sig = Signature.objects.using(db_alias).get(pk=sig.parent_id)

        try:
            meta = MetaInformation.objects.using(db_alias).get(signature=lookup_sig)
        except MetaInformation.DoesNotExist:
            skipped += 1
            print(f"  WARNING: MetaInformation for '{inscription_id}' not found – skipped")
            continue

        ref, _ = Reference.objects.using(db_alias).get_or_create(
            text=url,
            defaults={"kind": "link", "label": label},
        )
        meta.references.add(ref)
        added += 1

    print(f"\n  Bautil links: {added} added, {skipped} skipped")


def reverse_bautil_links(apps, schema_editor):
    MetaInformation = apps.get_model("runes", "MetaInformation")
    Signature = apps.get_model("runes", "Signature")
    Reference = apps.get_model("runes", "Reference")

    db_alias = schema_editor.connection.alias

    removed = 0

    for inscription_id, ds_id, page in _read_csv():
        url = _URL_TEMPLATE.format(ds_id=ds_id)

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

        # Delete the reference if no inscriptions are linked to it anymore.
        if not ref.meta_informations.exists():
            ref.delete()
            removed += 1

    print(f"\n  Bautil links reverse: {removed} references deleted")


class Migration(migrations.Migration):

    dependencies = [
        ("runes", "0006_extract_runer_ku_dk_references"),
    ]

    operations = [
        migrations.RunPython(add_bautil_links, reverse_bautil_links),
    ]
