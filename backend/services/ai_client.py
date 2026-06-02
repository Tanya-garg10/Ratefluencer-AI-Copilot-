"""
Cerebras AI client — OpenAI-compatible SDK.

Cerebras runs Llama models at 1000+ tokens/sec.
Drop-in replacement for OpenAI API using base_url override.

Docs: https://inference-docs.cerebras.ai/
"""

from __future__ import annotations

import os
import json
import logging
from typing import Any, Dict, Optional

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(override=True)

logger = logging.getLogger(__name__)

CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY", "")
CEREBRAS_MODEL   = os.getenv("CEREBRAS_MODEL", "llama-3.3-70b")
CEREBRAS_BASE_URL = "https://api.cerebras.ai/v1"

# Singleton client
_client: Optional[OpenAI] = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        if not CEREBRAS_API_KEY or CEREBRAS_API_KEY == "your_cerebras_api_key_here":
            raise ValueError(
                "CEREBRAS_API_KEY not set. "
                "Get your key from https://cloud.cerebras.ai/ "
                "and add it to backend/.env"
            )
        _client = OpenAI(
            api_key=CEREBRAS_API_KEY,
            base_url=CEREBRAS_BASE_URL,
        )
    return _client


def chat(
    system: str,
    user: str,
    model: str = CEREBRAS_MODEL,
    max_tokens: int = 1024,
    temperature: float = 0.8,
) -> str:
    """Send a chat request to Cerebras and return the text response."""
    client = get_client()
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return response.choices[0].message.content or ""


def chat_json(
    system: str,
    user: str,
    model: str = CEREBRAS_MODEL,
    max_tokens: int = 1024,
    temperature: float = 0.7,
) -> Dict[str, Any]:
    """
    Send a chat request and parse the JSON response.
    The system prompt should instruct the model to respond with pure JSON.
    """
    raw = chat(system, user, model=model, max_tokens=max_tokens, temperature=temperature)

    # Strip markdown code fences if present
    text = raw.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        # Remove first and last fence lines
        text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.warning("Cerebras response was not valid JSON, returning raw text")
        return {"raw": text}


def is_configured() -> bool:
    """Return True if the API key is set and non-empty."""
    return bool(CEREBRAS_API_KEY and CEREBRAS_API_KEY != "your_cerebras_api_key_here")
