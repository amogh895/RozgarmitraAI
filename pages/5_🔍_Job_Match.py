"""
pages/5_🔍_Job_Match.py
Browse sample jobs and get an AI match score against the user's profile.
"""

import json
import uuid
from pathlib import Path

import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import job_match_prompt
from utils.data_store import load_profile

st.set_page_config(page_title="Job Match – RozgarMitra AI", page_icon="🔍", layout="centered")

if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]

profile = load_profile(session_id)

# ── Load sample jobs ──────────────────────────────────────────────────────────
JOBS_FILE = Path(__file__).parent.parent / "data" / "sample_jobs.json"
with open(JOBS_FILE, "r", encoding="utf-8") as f:
    jobs = json.load(f)

st.title("🔍 Job Match")
st.caption("Select a job listing and let IBM Granite score how well your profile fits.")

if not profile:
    st.info("👤 Complete your profile first to get a personalised match score.")

# ── Job selector ──────────────────────────────────────────────────────────────
job_titles = [f"{j['title']} @ {j['company']}" for j in jobs]
selected_idx = st.selectbox("Choose a job listing", range(len(job_titles)), format_func=lambda i: job_titles[i])
selected_job = jobs[selected_idx]

st.divider()
col1, col2 = st.columns([2, 1])
with col1:
    st.markdown(f"**{selected_job['title']}**")
    st.write(selected_job["description"])
with col2:
    st.markdown(f"🏢 {selected_job['company']}")
    st.markdown(f"📍 {selected_job['location']}")
    st.markdown(f"🗓️ {selected_job['experience_years']}+ yrs exp")
    st.markdown(f"🛠️ {', '.join(selected_job['skills_required'])}")

if st.button("⚡ Analyse My Fit", type="primary"):
    if not profile:
        st.warning("Please save your profile before running a match analysis.")
    else:
        job_listing_text = (
            f"Title: {selected_job['title']}\n"
            f"Company: {selected_job['company']}\n"
            f"Required Skills: {', '.join(selected_job['skills_required'])}\n"
            f"Experience Required: {selected_job['experience_years']}+ years\n"
            f"Description: {selected_job['description']}"
        )
        with st.spinner("IBM Granite is analysing your fit…"):
            try:
                prompt = job_match_prompt(profile, job_listing_text)
                result = generate(prompt)
                st.divider()
                st.subheader("Match Analysis")
                st.markdown(result)
            except EnvironmentError as e:
                st.error(f"Configuration error: {e}")
            except Exception as e:
                st.error(f"Something went wrong: {e}")
