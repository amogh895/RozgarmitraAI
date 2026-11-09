"""
pages/3_💼_Career_Guidance.py
Conversational career mentoring — multilingual.
"""

import uuid
import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import career_guidance_prompt
from utils.data_store import load_profile, append_message, load_history, clear_history
from utils.i18n import t, lang_selector

st.set_page_config(page_title="Career Guidance – RozgarMitra AI", page_icon="💼", layout="centered")

if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]

lang = lang_selector()
profile = load_profile(session_id)

st.title(t("guidance_title", lang))
st.caption(t("guidance_caption", lang))

if not profile:
    st.info(t("guidance_no_profile", lang))

history = load_history(session_id)
for msg in history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

question = st.chat_input(t("guidance_placeholder", lang))

if question:
    with st.chat_message("user"):
        st.markdown(question)
    append_message(session_id, "user", question)

    with st.chat_message("assistant"):
        with st.spinner(t("guidance_thinking", lang)):
            try:
                prompt = career_guidance_prompt(profile, question)
                answer = generate(prompt)
                st.markdown(answer)
                append_message(session_id, "assistant", answer)
            except EnvironmentError as e:
                st.error(f"{t('config_error', lang)}{e}")
            except Exception as e:
                st.error(f"{t('generic_error', lang)}{e}")

if history and st.button(t("guidance_clear", lang)):
    clear_history(session_id)
    st.rerun()
