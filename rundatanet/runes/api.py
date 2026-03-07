import json
import logging
from typing import Any, Optional

from django.conf import settings
from ninja import NinjaAPI, Schema

from .inference import inference
from .models import MetaInformation, Signature
from .normalization import SlugIndex, normalize_signature
from .serializers import MetaInformationSerializer

logger = logging.getLogger(__name__)

api = NinjaAPI()


class TextRequest(Schema):
    text: str


class TextResponse(Schema):
    rules: str
    error: Optional[str] = None


class InscriptionResponse(Schema):
    signature: str
    canonical_slug: str
    aliases: list[str]
    meta: dict[str, Any]


class ErrorResponse(Schema):
    detail: str


@api.post("/txt2rules", response=TextResponse)
def txt2rules(request, data: TextRequest):
    try:
        # Call the inference function to get the rules
        llm_response = inference(data.text)

        # Here you would call the function to convert text to rules
        resp = TextResponse(rules=llm_response)
    except Exception as e:
        # Handle the exception and return an error response
        logger.error(f"Error converting text to rules: {str(e)}", exc_info=True)

        resp = TextResponse(rules="", error="Failed to convert text to rules")
    return resp


@api.get(
    "/inscription/{slug}",
    response={200: InscriptionResponse, 404: ErrorResponse},
)
def inscription_detail_api(request, slug: str):
    """Return inscription data as JSON by normalized slug.

    Alias slugs are resolved transparently to the canonical inscription.
    """
    index = SlugIndex.get()
    result = index.resolve(slug)

    if result is None:
        return 404, {"detail": "Inscription not found"}

    canonical_id, canonical_slug = result

    try:
        signature = Signature.objects.get(id=canonical_id)
    except Signature.DoesNotExist:
        return 404, {"detail": "Inscription not found"}

    try:
        meta = (
            MetaInformation.objects.select_related("signature", "materialType")
            .prefetch_related("images", "references")
            .get(signature=signature)
        )
    except MetaInformation.DoesNotExist:
        return 404, {"detail": "Inscription metadata not found"}

    serializer = MetaInformationSerializer(meta)

    aliases = list(Signature.objects.filter(parent=signature).values_list("signature_text", flat=True))

    return 200, {
        "signature": signature.signature_text,
        "canonical_slug": canonical_slug,
        "aliases": aliases,
        "meta": serializer.data,
    }
