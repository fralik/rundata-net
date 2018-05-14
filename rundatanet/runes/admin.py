from django.contrib import admin
from django.utils.translation import ugettext_lazy

# Register your models here.
from .models import *

def export_csv(modeladmin, request, queryset):
    import csv
    from django.utils.encoding import smart_str
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=mymodel.csv'
    writer = csv.writer(response, csv.excel)
    response.write(u'\ufeff'.encode('utf8')) # BOM (optional...Excel needs it to open UTF-8 file properly)
    writer.writerow([
        smart_str(u"ID"),
        smart_str(u"Text"),
        smart_str(u"parent"),
    ])
    for obj in queryset:
        writer.writerow([
            smart_str(obj.pk),
            smart_str(obj.signature_text),
            smart_str(obj.parent),
        ])
    return response
export_csv.short_description = u"Export CSV"

class MyModelAdmin(admin.ModelAdmin):
    actions = [export_csv]

class ImageInline(admin.TabularInline):
    model=ImageLink
    extra = 3

# class SignatureInline(admin.TabularInline):
#     """docstring for SignatureInline"""
#     model = SignatureMetaRelation
#     extra = 1
#     readonly_fields = ('signature',)
#     can_delete = False


class MetaInformationAdmin(MyModelAdmin):
    inlines = [
        #SignatureInline,
        ImageInline]
    fieldsets = (
        (None,          {'fields': (('lost', 'new_reading'),)}),
        ('Object',      {'fields': ('dating', 'rune_type', 'style', 'carver', 'material', 'materialType')}),
        ('Location',    {'fields': ('found_location', 'parish', 'district', 'municipality', 'original_site', 'parish_code')}),
        ('Coordinates', {'fields': (('latitude', 'longitude'), ('present_latitude', 'present_longitude'),)}),
        ('Other',       {'fields': ('objectInfo', 'additional', 'reference')}),
    )
    change_form_template = 'admin/change_form_meta.html'

admin.site.register(CrossForm)
admin.site.register(Signature)
admin.site.register(CrossDefinition);
admin.site.register(Cross);
admin.site.register(MaterialType);
admin.site.register(Material);
admin.site.register(MetaInformation, MetaInformationAdmin);
# admin.site.register(SignatureMetaRelation);
admin.site.register(ImageLink);
admin.site.register(NormalisationNorse);
admin.site.register(NormalisationScandinavian);
admin.site.register(TransliteratedText);
admin.site.register(TranslationEnglish);

admin.site.site_header = ugettext_lazy('Rundata-net administration')
admin.site.site_title = ugettext_lazy('Rundata-net admin')
