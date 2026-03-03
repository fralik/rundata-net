"""Add normalised references column to the ``all_data`` database view.

Drops the existing view and re-creates it with:
- ``full_address`` computed column
- ``references_normalized`` – pipe-separated reference texts from the M2M table
"""

from django.db import migrations

# fmt: off

NEW_VIEW_SQL = """
DROP VIEW IF EXISTS all_data;

CREATE VIEW all_data AS SELECT
    signatures.signature_text,
    meta_information.district || ' ' || meta_information.parish || ' ' || meta_information.municipality || ' ' || meta_information.parish_code || ' ' || meta_information.found_location || ' ' || meta_information.current_location AS full_address,
    meta_information.*,
    ifnull(t1.num_names, 0) AS num_names,
    ifnull(t2.num_crosses, 0) AS num_crosses,
    ifnull(t3.references_text, '') AS references_normalized,
    material_types.name AS "material_type",
    normalisation_norse.value AS normalisation_norse,
    normalisation_norse.search_value AS normalisation_search_norse,
    normalisation_scandinavian.value AS normalisation_scandinavian,
    normalisation_scandinavian.search_value AS normalisation_search_scandinavian,
    translation_english.value AS english_translation,
    translation_swedish.value AS swedish_translation,
    transliterated_text.value AS transliteration,
    transliterated_text.search_value AS search_transliteration
FROM meta_information
INNER JOIN signatures ON (meta_information.signature_id = signatures.id)
INNER JOIN normalisation_norse ON (normalisation_norse.signature_id = meta_information.signature_id)
INNER JOIN normalisation_scandinavian ON (normalisation_scandinavian.signature_id = signatures.id)
LEFT JOIN translation_english ON (translation_english.signature_id = signatures.id)
LEFT JOIN translation_swedish ON (translation_swedish.signature_id = signatures.id)
INNER JOIN transliterated_text ON (transliterated_text.signature_id = signatures.id)
LEFT OUTER JOIN (
    SELECT signature_id, count(name_id) AS num_names
    FROM "runes_nameusage"
    GROUP BY signature_id
) AS t1 ON (t1.signature_id = meta_information.signature_id)
LEFT OUTER JOIN (
    SELECT meta_id, count(id) AS num_crosses
    FROM "crosses"
    GROUP BY crosses.meta_id
) AS t2 ON (t2.meta_id = meta_information.id)
LEFT OUTER JOIN (
    SELECT mr.metainformation_id, GROUP_CONCAT(r.text, ' | ') AS references_text
    FROM meta_information_references mr
    INNER JOIN "references" r ON r.id = mr.reference_id
    GROUP BY mr.metainformation_id
) AS t3 ON (t3.metainformation_id = meta_information.id)
LEFT OUTER JOIN material_types ON (material_types.id = meta_information.materialType_id)
GROUP BY meta_information.id;
"""

OLD_VIEW_SQL = """
DROP VIEW IF EXISTS all_data;

CREATE VIEW all_data AS SELECT
    signatures.signature_text,
    meta_information.district || ' ' || meta_information.parish || ' ' || meta_information.municipality || ' ' || meta_information.parish_code || ' ' || meta_information.found_location || ' ' || meta_information.current_location AS full_address,
    meta_information.*,
    ifnull(t1.num_names, 0) AS num_names,
    ifnull(t2.num_crosses, 0) AS num_crosses,
    material_types.name AS "material_type",
    normalisation_norse.value AS normalisation_norse,
    normalisation_norse.search_value AS normalisation_search_norse,
    normalisation_scandinavian.value AS normalisation_scandinavian,
    normalisation_scandinavian.search_value AS normalisation_search_scandinavian,
    translation_english.value AS english_translation,
    translation_swedish.value AS swedish_translation,
    transliterated_text.value AS transliteration,
    transliterated_text.search_value AS search_transliteration
FROM meta_information
INNER JOIN signatures ON (meta_information.signature_id = signatures.id)
INNER JOIN normalisation_norse ON (normalisation_norse.signature_id = meta_information.signature_id)
INNER JOIN normalisation_scandinavian ON (normalisation_scandinavian.signature_id = signatures.id)
LEFT JOIN translation_english ON (translation_english.signature_id = signatures.id)
LEFT JOIN translation_swedish ON (translation_swedish.signature_id = signatures.id)
INNER JOIN transliterated_text ON (transliterated_text.signature_id = signatures.id)
LEFT OUTER JOIN (
    SELECT signature_id, count(name_id) AS num_names
    FROM "runes_nameusage"
    GROUP BY signature_id
) AS t1 ON (t1.signature_id = meta_information.signature_id)
LEFT OUTER JOIN (
    SELECT meta_id, count(id) AS num_crosses
    FROM "crosses"
    GROUP BY crosses.meta_id
) AS t2 ON (t2.meta_id = meta_information.id)
LEFT OUTER JOIN material_types ON (material_types.id = meta_information.materialType_id)
GROUP BY meta_information.id;
"""

# fmt: on


class Migration(migrations.Migration):

    dependencies = [
        ("runes", "0004_populate_references"),
    ]

    operations = [
        migrations.RunSQL(
            sql=NEW_VIEW_SQL,
            reverse_sql=OLD_VIEW_SQL,
        ),
    ]
