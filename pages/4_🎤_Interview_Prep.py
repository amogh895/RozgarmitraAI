"""
pages/4_🎤_Interview_Prep.py
Generate interview questions via IBM Granite — multilingual.
"""

import uuid
import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import interview_prep_prompt
from utils.data_store import load_profile
from utils.i18n import t, lang_selector

st.set_page_config(page_title="Interview Prep – RozgarMitra AI", page_icon="🎤", layout="centered")

if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]

lang = lang_selector()
profile = load_profile(session_id)

st.title(t("interview_title", lang))
st.caption(t("interview_caption", lang))

job_role = st.text_input(
    t("interview_role_label", lang),
    value=profile.get("current_role", ""),
    placeholder=t("interview_role_ph", lang),
)

skills_default = ", ".join(profile.get("skills", []))
skills_raw = st.text_input(
    t("interview_skills_label", lang),
    value=skills_default,
)

question_count = st.slider(t("interview_count", lang), min_value=3, max_value=10, value=5)

if st.button(t("interview_btn", lang), type="primary"):
    if not job_role.strip():
        st.warning(t("interview_warn", lang))
    else:
        skills = [s.strip() for s in skills_raw.split(",") if s.strip()]
        with st.spinner(t("interview_spinner", lang)):
            try:
                prompt = interview_prep_prompt(job_role, skills, question_count)
                result = generate(prompt)
                st.divider()
                st.subheader(t("interview_result_hdr", lang))
                st.markdown(result)
            except EnvironmentError as e:
                st.error(f"{t('config_error', lang)}{e}")
            except Exception as e:
                st.error(f"{t('generic_error', lang)}{e}")
