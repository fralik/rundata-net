from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext_lazy
from nested_admin import NestedModelAdmin, NestedStackedInline, NestedTabularInline

# Register your models here.
from .models import (
    Cross,
    CrossDefinition,
    CrossForm,
    ImageLink,
    Material,
    MaterialType,
    MetaInformation,
    NormalisationNorse,
    NormalisationScandinavian,
    Signature,
    TranslationEnglish,
    TransliteratedText,
)


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


class ImageInline(NestedTabularInline):
    model = ImageLink
    # Number of empty forms to display for adding new ImageLinks
    extra = 3


class NormalisationNorseInline(NestedStackedInline):
    model = NormalisationNorse
    extra = 0


class NormalisationScandinavianInline(NestedStackedInline):
    model = NormalisationScandinavian
    extra = 0


class TransliteradedTextInline(NestedStackedInline):
    model = TransliteratedText
    extra = 0


class TranslationEnglishInline(NestedStackedInline):
    model = TranslationEnglish
    extra = 0


class MetaInformationInline(NestedStackedInline):
    model = MetaInformation
    # Number of empty forms to display for adding new MetaInformations
    extra = 0
    inlines = [ImageInline]
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


# @admin.register(MetaInformation)
# class MetaInformationAdmin(MyModelAdmin):
#     inlines = [
#         ImageInline
#     ]
#     fieldsets = (
#         (None, {"fields": (("lost", "new_reading"),)}),
#         ("Object", {"fields": ("dating", "rune_type", "style", "carver", "material", "materialType")}),
#         (
#             "Location",
#             {"fields": ("found_location", "parish", "district", "municipality", "original_site", "parish_code")},
#         ),
#         (
#             "Coordinates",
#             {
#                 "fields": (
#                     ("latitude", "longitude"),
#                     ("present_latitude", "present_longitude"),
#                 )
#             },
#         ),
#         ("Other", {"fields": ("objectInfo", "additional", "reference")}),
#     )
#     change_form_template = "admin/change_form_meta.html"
#     list_filter = ["new_reading", "lost"]
#     search_fields = ("signature__signature_text__exact",)
#     ordering = ("signature__signature_text",)


@admin.register(Signature)
class SignatureAdmin(NestedModelAdmin):
    inlines = [
        MetaInformationInline,
        NormalisationNorseInline,
        NormalisationScandinavianInline,
        TransliteradedTextInline,
        TranslationEnglishInline,
    ]

    search_fields = ("signature_text__exact",)
    ordering = ("id",)
    readonly_fields = ("signature_text", "parent")

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        qs = super().get_queryset(request)
        return qs.filter(parent__isnull=True)


admin.site.register(CrossForm)
admin.site.register(CrossDefinition)
admin.site.register(Cross)
admin.site.register(MaterialType)
admin.site.register(Material)
admin.site.register(ImageLink)

admin.site.site_header = gettext_lazy("Rundata-net administration")
admin.site.site_title = gettext_lazy("Rundata-net admin")
