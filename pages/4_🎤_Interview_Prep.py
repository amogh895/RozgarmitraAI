"""
pages/4_🎤_Interview_Prep.py
Generate role-specific interview questions with tips via IBM Granite.
"""

import uuid
import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import interview_prep_prompt
from utils.data_store import load_profile

st.set_page_config(page_title="Interview Prep – RozgarMitra AI", page_icon="🎤", layout="centered")

if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]

profile = load_profile(session_id)

st.title("🎤 Interview Prep")
st.caption("Get AI-generated interview questions with tips, tailored to your target role.")

job_role = st.text_input(
    "Target Job Role",
    value=profile.get("current_role", ""),
    placeholder="e.g. Data Scientist, Backend Developer…",
)

skills_default = ", ".join(profile.get("skills", []))
skills_raw = st.text_input(
    "Key Skills (comma-separated)",
    value=skills_default,
    placeholder="e.g. Python, Machine Learning, SQL",
)

question_count = st.slider("Number of questions", min_value=3, max_value=10, value=5)

if st.button("🎯 Generate Questions", type="primary"):
    if not job_role.strip():
        st.warning("Please enter a target job role.")
    else:
        skills = [s.strip() for s in skills_raw.split(",") if s.strip()]
        with st.spinner("IBM Granite is preparing your questions…"):
            try:
                prompt = interview_prep_prompt(job_role, skills, question_count)
                result = generate(prompt)
                st.divider()
                st.subheader("Interview Questions & Tips")
                st.markdown(result)
            except EnvironmentError as e:
                st.error(f"Configuration error: {e}")
            except Exception as e:
                st.error(f"Something went wrong: {e}")
