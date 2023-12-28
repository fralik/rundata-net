from django.contrib import admin
from django.utils.translation import gettext_lazy

# Register your models here.
from .models import *


@admin.action(description="Export CSV")
def export_csv(modeladmin, request, queryset):
    import csv

    from django.utils.encoding import smart_str

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = "attachment; filename=mymodel.csv"
    writer = csv.writer(response, csv.excel)
    response.write("\ufeff".encode("utf8"))  # BOM (optional...Excel needs it to open UTF-8 file properly)
    writer.writerow(
        [
            smart_str("ID"),
            smart_str("Text"),
            smart_str("parent"),
        ]
    )
    for obj in queryset:
        writer.writerow(
            [
                smart_str(obj.pk),
                smart_str(obj.signature_text),
                smart_str(obj.parent),
            ]
        )
    return response


class MyModelAdmin(admin.ModelAdmin):
    actions = [export_csv]


class ImageInline(admin.TabularInline):
    model = ImageLink
    extra = 3


# class SignatureInline(admin.TabularInline):
#     """docstring for SignatureInline"""
#     model = SignatureMetaRelation
#     extra = 1
#     readonly_fields = ('signature',)
#     can_delete = False


@admin.register(MetaInformation)
class MetaInformationAdmin(MyModelAdmin):
    inlines = [
        # SignatureInline,
        ImageInline
    ]
    fieldsets = (
        (None, {"fields": (("lost", "new_reading"),)}),
        ("Object", {"fields": ("dating", "rune_type", "style", "carver", "material", "materialType")}),
        (
            "Location",
            {"fields": ("found_location", "parish", "district", "municipality", "original_site", "parish_code")},
        ),
        (
            "Coordinates",
            {
                "fields": (
                    ("latitude", "longitude"),
                    ("present_latitude", "present_longitude"),
                )
            },
        ),
        ("Other", {"fields": ("objectInfo", "additional", "reference")}),
    )
    change_form_template = "admin/change_form_meta.html"


admin.site.register(CrossForm)
admin.site.register(Signature)
admin.site.register(CrossDefinition)
admin.site.register(Cross)
admin.site.register(MaterialType)
admin.site.register(Material)

# admin.site.register(SignatureMetaRelation);
admin.site.register(ImageLink)
admin.site.register(NormalisationNorse)
admin.site.register(NormalisationScandinavian)
admin.site.register(TransliteratedText)
admin.site.register(TranslationEnglish)

admin.site.site_header = gettext_lazy("Rundata-net administration")
admin.site.site_title = gettext_lazy("Rundata-net admin")
