"""
utils/watsonx_client.py
-----------------------
Thin wrapper around ibm-watsonx-ai to call IBM Granite models.

Credential resolution order (first non-empty value wins):
  1. st.secrets  – Streamlit Community Cloud secret manager
  2. os.environ  – local .env loaded via python-dotenv
"""

import os
import streamlit as st
from dotenv import load_dotenv
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

load_dotenv()

# ── Default model ────────────────────────────────────────────────────────────
DEFAULT_MODEL = "ibm/granite-4-h-small"

# ── Shared parameters ────────────────────────────────────────────────────────
DEFAULT_PARAMS = {
    GenParams.MAX_NEW_TOKENS: 1024,
    GenParams.TEMPERATURE: 0.7,
    GenParams.REPETITION_PENALTY: 1.1,
}


def _secret(key: str, default: str = "") -> str:
    """Read from st.secrets first, fall back to os.environ."""
    try:
        return st.secrets.get(key, os.getenv(key, default))
    except Exception:
        return os.getenv(key, default)


def _get_credentials() -> Credentials:
    api_key = _secret("WATSONX_API_KEY")
    url = _secret("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
    if not api_key:
        raise EnvironmentError(
            "WATSONX_API_KEY is not set. "
            "Add it to .streamlit/secrets.toml (local) or the Streamlit Cloud secrets dashboard."
        )
    return Credentials(url=url, api_key=api_key)


def get_model(model_id: str = DEFAULT_MODEL, params: dict | None = None) -> ModelInference:
    """Return a ready-to-use ModelInference instance."""
    project_id = _secret("WATSONX_PROJECT_ID")
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
