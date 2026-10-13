from django.db import migrations, models


def add_caption_columns(apps, schema_editor):
    table = "runes_imagelink"
    existing_columns = {
        row[1]
        for row in schema_editor.connection.cursor().execute(f"PRAGMA table_info('{table}')")
    }
    with schema_editor.connection.cursor() as cursor:
        if "info" not in existing_columns:
            cursor.execute(
                f"ALTER TABLE {table} ADD COLUMN info varchar(1500) NOT NULL DEFAULT ''"
            )
        if "original_info" not in existing_columns:
            cursor.execute(
                f"ALTER TABLE {table} ADD COLUMN original_info varchar(1500) NOT NULL DEFAULT ''"
            )


class Migration(migrations.Migration):

    dependencies = [
        ("runes", "0010_add_permanent_citation_links"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(add_caption_columns, migrations.RunPython.noop),
            ],
            state_operations=[
                migrations.AddField(
                    model_name="imagelink",
                    name="info",
                    field=models.CharField(blank=True, default="", max_length=1500),
                ),
                migrations.AddField(
                    model_name="imagelink",
                    name="original_info",
                    field=models.CharField(blank=True, default="", max_length=1500),
                ),
            ],
        ),
    ]
