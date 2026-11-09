"""
pages/1_👤_My_Profile.py
Collect and persist the user's career profile — multilingual.
"""

import uuid
import streamlit as st
from utils.data_store import save_profile, load_profile
from utils.i18n import t, lang_selector

st.set_page_config(page_title="My Profile – RozgarMitra AI", page_icon="👤", layout="centered")

if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]

lang = lang_selector()
existing = load_profile(session_id)

st.title(t("profile_title", lang))
st.caption(t("profile_caption", lang))

with st.form("profile_form"):
    name = st.text_input(t("profile_name", lang), value=existing.get("name", ""))
    current_role = st.text_input(t("profile_role", lang), value=existing.get("current_role", ""))
    experience_years = st.number_input(
        t("profile_exp", lang), min_value=0, max_value=50,
        value=int(existing.get("experience_years", 0)),
    )
    skills_raw = st.text_area(
        t("profile_skills", lang),
        value=", ".join(existing.get("skills", [])),
        placeholder=t("profile_skills_ph", lang),
    )
    career_goal = st.text_area(
        t("profile_goal", lang),
        value=existing.get("career_goal", ""),
        placeholder=t("profile_goal_ph", lang),
    )
    submitted = st.form_submit_button(t("profile_save", lang))

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
    st.success(t("profile_saved_ok", lang))

saved = load_profile(session_id)
if saved:
    st.divider()
    st.subheader(t("profile_view", lang))
    st.json(saved)
