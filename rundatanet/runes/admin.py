from django.contrib import admin

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

admin.site.register(CrossForm)
