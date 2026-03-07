from django.http import Http404, HttpResponse
from django.shortcuts import redirect, render

from .models import MetaInformation, Signature
from .normalization import SlugIndex, normalize_signature
from .serializers import MetaInformationSerializer


def inscription_detail(request, slug: str):
    """Display a single inscription by its normalized slug.

    If the slug matches an alias signature, 301-redirects to the canonical URL.
    """
    index = SlugIndex.get()
    result = index.resolve(slug)

    if result is None:
        raise Http404("Inscription not found")

    canonical_id, canonical_slug = result

    # Redirect aliases and non-canonical slug forms to the canonical URL
    if slug != canonical_slug:
        return redirect("runes:inscription_detail", slug=canonical_slug, permanent=True)

    try:
        signature = Signature.objects.get(id=canonical_id)
    except Signature.DoesNotExist:
        raise Http404("Inscription not found")

    try:
        meta = (
            MetaInformation.objects.select_related("signature", "materialType")
            .prefetch_related("images", "references")
            .get(signature=signature)
        )
    except MetaInformation.DoesNotExist:
        raise Http404("Inscription metadata not found")

    serializer = MetaInformationSerializer(meta)
    data = serializer.data

    # Build display signature with † and $ decorators
    display_signature = signature.signature_text
    decorators = ""
    if meta.lost:
        decorators += "†"
    if meta.new_reading:
        decorators += "$"
    if decorators:
        display_signature += " " + decorators

    # Gather aliases
    aliases = list(Signature.objects.filter(parent=signature).values_list("signature_text", flat=True))

    context = {
        "signature": signature.signature_text,
        "display_signature": display_signature,
        "canonical_slug": canonical_slug,
        "aliases": aliases,
        "meta": meta,
        "data": data,
    }
    return render(request, "runes/inscription_detail.html", context)
