import json
import logging
from typing import Optional

from django.conf import settings
from ninja import NinjaAPI, Schema

from .inference import inference

logger = logging.getLogger(__name__)

api = NinjaAPI()


class TextRequest(Schema):
    text: str


class TextResponse(Schema):
    rules: str
    error: Optional[str] = None


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
