"""
pages/1_👤_My_Profile.py
Collect and persist the user's career profile.
"""

import uuid
import streamlit as st
from utils.data_store import save_profile, load_profile

st.set_page_config(page_title="My Profile – RozgarMitra AI", page_icon="👤", layout="centered")

# ── Session ID (persisted across reruns via session_state) ───────────────────
if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]

# ── Load existing profile ────────────────────────────────────────────────────
existing = load_profile(session_id)

st.title("👤 My Profile")
st.caption("Your profile is used by all other features to personalise AI responses.")

with st.form("profile_form"):
    name = st.text_input("Full Name", value=existing.get("name", ""))
    current_role = st.text_input("Current Role / Title", value=existing.get("current_role", ""))
    experience_years = st.number_input(
        "Years of Experience", min_value=0, max_value=50,
        value=int(existing.get("experience_years", 0)),
    )
    skills_raw = st.text_area(
        "Skills (comma-separated)",
        value=", ".join(existing.get("skills", [])),
        placeholder="e.g. Python, SQL, Machine Learning, Communication",
    )
    career_goal = st.text_area(
        "Career Goal",
        value=existing.get("career_goal", ""),
        placeholder="e.g. Become a Senior Data Scientist in 2 years.",
    )
    submitted = st.form_submit_button("💾 Save Profile")

if submitted:
    skills = [s.strip() for s in skills_raw.split(",") if s.strip()]
    profile = {
        "name": name,
        "current_role": current_role,
        "experience_years": experience_years,
        "skills": skills,
        "career_goal": career_goal,
    }
    save_profile(session_id, profile)
    st.session_state["profile"] = profile
    st.success("Profile saved! ✅ You can now use all features.")

# ── Show saved profile ────────────────────────────────────────────────────────
saved = load_profile(session_id)
if saved:
    st.divider()
    st.subheader("Saved Profile")
    st.json(saved)
