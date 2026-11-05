"""
utils/watsonx_client.py
-----------------------
Thin wrapper around ibm-watsonx-ai to call IBM Granite models.
All credentials are loaded from environment variables (via .env).
"""

import os
from dotenv import load_dotenv
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

load_dotenv()

# ── Default model ────────────────────────────────────────────────────────────
DEFAULT_MODEL = "ibm/granite-3-8b-instruct"

# ── Shared parameters ────────────────────────────────────────────────────────
DEFAULT_PARAMS = {
    GenParams.MAX_NEW_TOKENS: 1024,
    GenParams.TEMPERATURE: 0.7,
    GenParams.REPETITION_PENALTY: 1.1,
}


def _get_credentials() -> Credentials:
    api_key = os.getenv("WATSONX_API_KEY")
    url = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
    if not api_key:
        raise EnvironmentError(
            "WATSONX_API_KEY is not set. Copy .env.example → .env and fill in your credentials."
        )
    return Credentials(url=url, api_key=api_key)


def get_model(model_id: str = DEFAULT_MODEL, params: dict | None = None) -> ModelInference:
    """Return a ready-to-use ModelInference instance."""
    project_id = os.getenv("WATSONX_PROJECT_ID")
    if not project_id:
        raise EnvironmentError("WATSONX_PROJECT_ID is not set.")
    return ModelInference(
        model_id=model_id,
        credentials=_get_credentials(),
        project_id=project_id,
        params=params or DEFAULT_PARAMS,
    )


def generate(prompt: str, model_id: str = DEFAULT_MODEL, params: dict | None = None) -> str:
    """
    Send a prompt to IBM Granite and return the generated text string.

    Parameters
    ----------
    prompt   : The full prompt string (system + user content combined).
    model_id : Granite model identifier on watsonx.ai.
    params   : Optional override for generation parameters.

    Returns
    -------
    Generated text as a plain string.
    """
    model = get_model(model_id=model_id, params=params)
    response = model.generate_text(prompt=prompt)
    return response
