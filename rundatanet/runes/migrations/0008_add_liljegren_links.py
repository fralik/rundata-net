"""Data migration: add Liljegren Runurkunder page links to L-inscriptions.

Reads ``Liljegren_Runurkunder_L_signatures_page_links.csv`` (co-located
in this migrations folder) and for each row creates a ``kind='link'``
Reference pointing to the litteraturbanken.se faksimil page, labelled
``Liljegren, page <page>``.  The reference is then associated with the
``MetaInformation`` record whose signature matches the ``Id number``
column.

Multiple inscriptions may share the same URL (page), so ``get_or_create``
is used to avoid duplicates.
"""

import csv
import os
import re

from django.db import migrations

_CSV_FILE = os.path.join(
    os.path.dirname(__file__),
    "Liljegren_Runurkunder_L_signatures_page_links.csv",
)

_PAGE_RE = re.compile(r"/sida/(\d+)/faksimil")


def _read_csv():
    """Yield (inscription_id, url, page) tuples from the CSV file."""
    with open(_CSV_FILE, newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            inscription_id = row["Id number"]
            url = row["Link"]
            m = _PAGE_RE.search(url)
            if not m:
                continue
            yield inscription_id, url, m.group(1)


def add_liljegren_links(apps, schema_editor):
    Signature = apps.get_model("runes", "Signature")
    MetaInformation = apps.get_model("runes", "MetaInformation")
    Reference = apps.get_model("runes", "Reference")

    db_alias = schema_editor.connection.alias

    added = 0
    skipped = 0

    for inscription_id, url, page in _read_csv():
        label = f"Liljegren, page {page}"

        try:
            sig = Signature.objects.using(db_alias).get(
                signature_text=inscription_id,
            )
        except Signature.DoesNotExist:
            skipped += 1
            print(f"  WARNING: inscription '{inscription_id}' not found – skipped")
            continue

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

    print(f"\n  Liljegren links: {added} added, {skipped} skipped")


def reverse_liljegren_links(apps, schema_editor):
    MetaInformation = apps.get_model("runes", "MetaInformation")
    Signature = apps.get_model("runes", "Signature")
    Reference = apps.get_model("runes", "Reference")

    db_alias = schema_editor.connection.alias

    removed = 0

    for inscription_id, url, _page in _read_csv():
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

    print(f"\n  Liljegren links reverse: {removed} references deleted")


class Migration(migrations.Migration):

    dependencies = [
        ("runes", "0007_add_bautil_links"),
    ]

    operations = [
        migrations.RunPython(add_liljegren_links, reverse_liljegren_links),
    ]
