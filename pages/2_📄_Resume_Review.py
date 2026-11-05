"""
pages/2_📄_Resume_Review.py
Paste a resume, optionally add a job description, get IBM Granite feedback.
"""

import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import resume_review_prompt

st.set_page_config(page_title="Resume Review – RozgarMitra AI", page_icon="📄", layout="centered")

st.title("📄 Resume Review")
st.caption("Paste your resume below. IBM Granite will score it and suggest improvements.")

resume_text = st.text_area(
    "Your Resume",
    height=300,
    placeholder="Paste the full text of your resume here…",
)

job_description = st.text_area(
    "Target Job Description (optional)",
    height=120,
    placeholder="Paste the job description to get tailored feedback…",
)

if st.button("🔍 Review My Resume", type="primary"):
    if not resume_text.strip():
        st.warning("Please paste your resume text first.")
    else:
        with st.spinner("IBM Granite is reviewing your resume…"):
            try:
                prompt = resume_review_prompt(resume_text, job_description)
                result = generate(prompt)
                st.divider()
                st.subheader("AI Feedback")
                st.markdown(result)
            except EnvironmentError as e:
                st.error(f"Configuration error: {e}")
            except Exception as e:
                st.error(f"Something went wrong: {e}")
