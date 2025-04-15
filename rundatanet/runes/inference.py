import importlib.resources
import logging
import os
from typing import Optional

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from django.conf import settings

logger = logging.getLogger(__name__)


def clean_llm_response(llm_response: str) -> str:
    if "<|fim_suffix|>" in llm_response:
        llm_response = llm_response.split("<|fim_suffix|>")[0]
    if "```json" in llm_response:
        llm_response = llm_response.split("```json", 1)[1]
    if "```" in llm_response:
        llm_response = llm_response.rsplit("```", 1)[0]

    return llm_response.strip()


def _get_system_message() -> SystemMessage:
    """
    Get the system message for the model.
    """
    # Load the system message from a file
    system_prompt = importlib.resources.files("rundatanet.runes").joinpath("prompt.txt").read_text(encoding="utf-8")
    return SystemMessage(content=system_prompt)


def inference(user_msg: str, api_token: Optional[str] = None) -> str:
    endpoint = "https://Phi-4-kduuo.eastus2.models.ai.azure.com"
    model_name = "Phi-4"
    api_token = api_token or settings.MODEL_KEY

    if not api_token:
        raise ValueError("Failed to obtain API token")

    client = ChatCompletionsClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(api_token),
    )
    system_prompt = _get_system_message()

    response = client.complete(
        messages=[system_prompt, UserMessage(content=user_msg)],
        max_tokens=4096,
        temperature=0.0,
        top_p=0.1,
        presence_penalty=0.0,
        frequency_penalty=0.0,
        model=model_name,
    )
    logger.debug(f"Raw LLM response: {response.choices[0].message.content}")

    return clean_llm_response(response.choices[0].message.content)
