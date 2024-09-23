# Generated by Django 5.0 on 2024-01-04 10:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("runes", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="metainformation",
            name="year_from",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="metainformation",
            name="year_to",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name="TranslationSwedish",
            fields=[
                ("value", models.TextField(blank=True)),
                ("search_value", models.TextField(blank=True)),
                (
                    "signature",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="translation_swedish",
                        serialize=False,
                        to="runes.signature",
                    ),
                ),
            ],
            options={
                "db_table": "translation_swedish",
                "indexes": [models.Index(fields=["search_value"], name="translation_search__1eac6a_idx")],
            },
        ),
        # Create view all_data
        migrations.RunSQL(
            """
            CREATE VIEW all_data AS SELECT signatures.signature_text, meta_information.*,
            ifnull(t1.num_names, 0) as num_names, ifnull(t2.num_crosses, 0) as num_crosses,
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
            LEFT OUTER JOIN (SELECT signature_id, count(name_id) AS num_names from "runes_nameusage" GROUP BY signature_id) AS t1 ON (t1.signature_id = meta_information.signature_id)
            LEFT OUTER JOIN (SELECT meta_id, count(id) as num_crosses FROM "crosses" GROUP BY crosses.meta_id) AS t2 on (t2.meta_id = meta_information.id)
            LEFT OUTER JOIN material_types ON (material_types.id = meta_information.materialType_id)
            GROUP by meta_information.id
            """,
            reverse_sql="DROP VIEW IF EXISTS all_data;",
        ),
        # Create view meta_with_crosses_textual
        migrations.RunSQL(
            """
            CREATE VIEW meta_with_crosses_textual AS
            SELECT
                meta_id,
                GROUP_CONCAT(concatenated_group_texts, ' & ') AS crosses_textual
            FROM (
                SELECT
                    meta_id,
                    id AS cross_id,
                    concatenated_group_texts
                FROM crosses
                LEFT JOIN (
                SELECT
                    cross_id,
                    GROUP_CONCAT(group_text, '; ') AS concatenated_group_texts
                FROM
                (
                    SELECT
                        cd.cross_id,
                        cf.group_id,
                        GROUP_CONCAT(
                            CASE
                                WHEN cd.is_certain = 0 THEN cf.name || '(?)'
                                ELSE cf.name
                            END,
                            '-'
                        ) AS group_text
                    FROM
                        cross_definitions cd
                    LEFT JOIN cross_forms cf ON cd.form_id = cf.id
                    GROUP BY
                        cd.cross_id,
                        cf.group_id
                ) as cross_definitions_with_text
                GROUP BY
                cross_id
                ) AS crosses_individual_textual
                ON crosses_individual_textual.cross_id = crosses.id
            ) AS crosses_textual_raw
            GROUP BY
            crosses_textual_raw.meta_id
            """,
            reverse_sql="DROP VIEW IF EXISTS meta_with_crosses_textual;",
        ),
    ]
