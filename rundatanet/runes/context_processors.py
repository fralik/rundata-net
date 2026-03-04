from django.conf import settings


def azure_blob_base_url(request):
    """Expose AZURE_BLOB_BASE_URL to all templates so the frontend can
    construct full PDF blob URLs from bare blob filenames stored in the DB.
    """
    return {"AZURE_BLOB_BASE_URL": getattr(settings, "AZURE_BLOB_BASE_URL", "")}
