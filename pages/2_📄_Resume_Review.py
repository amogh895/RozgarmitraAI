"""
pages/2_📄_Resume_Review.py
Resume review with IBM Granite — multilingual.
"""

import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import resume_review_prompt
from utils.i18n import t, lang_selector

st.set_page_config(page_title="Resume Review – RozgarMitra AI", page_icon="📄", layout="centered")

lang = lang_selector()

st.title(t("resume_title", lang))
st.caption(t("resume_caption", lang))

resume_text = st.text_area(
    t("resume_input_label", lang),
    height=300,
    placeholder=t("resume_input_ph", lang),
)

job_description = st.text_area(
    t("resume_jd_label", lang),
    height=120,
    placeholder=t("resume_jd_ph", lang),
)

if st.button(t("resume_btn", lang), type="primary"):
    if not resume_text.strip():
        st.warning(t("resume_warn", lang))
    else:
        with st.spinner(t("resume_spinner", lang)):
            try:
                prompt = resume_review_prompt(resume_text, job_description)
                result = generate(prompt)
                st.divider()
                st.subheader(t("resume_result_hdr", lang))
                st.markdown(result)
            except EnvironmentError as e:
                st.error(f"{t('config_error', lang)}{e}")
            except Exception as e:
                st.error(f"{t('generic_error', lang)}{e}")
