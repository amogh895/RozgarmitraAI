"""
app.py  –  RozgarMitra AI
Entry point. Renders the Home / landing page and sets up global config.
"""

import streamlit as st

st.set_page_config(
    page_title="RozgarMitra AI",
    page_icon="🎯",
    layout="centered",
    initial_sidebar_state="expanded",
)

# ── Sidebar nav hint ──────────────────────────────────────────────────────────
st.sidebar.title("🎯 RozgarMitra AI")
st.sidebar.caption("Your AI-Powered Job & Career Mentor")
st.sidebar.markdown("---")
st.sidebar.info(
    "Use the **pages** above to navigate between features:\n\n"
    "- 👤 My Profile\n"
    "- 📄 Resume Review\n"
    "- 💼 Career Guidance\n"
    "- 🎤 Interview Prep\n"
    "- 🔍 Job Match"
)

# ── Hero section ──────────────────────────────────────────────────────────────
st.markdown(
    """
    <div style="text-align:center; padding: 2rem 0 1rem 0;">
        <h1 style="font-size:2.6rem; font-weight:800; color:#1a1a2e;">🎯 RozgarMitra AI</h1>
        <p style="font-size:1.2rem; color:#555;">Your AI-Powered Job &amp; Career Mentor</p>
        <p style="font-size:0.95rem; color:#888;">Powered by <strong>IBM Granite</strong> on <strong>IBM watsonx.ai</strong></p>
    </div>
    """,
    unsafe_allow_html=True,
)

st.divider()

# ── Feature cards ─────────────────────────────────────────────────────────────
col1, col2 = st.columns(2)

with col1:
    st.markdown("#### 👤 My Profile")
    st.write("Set up your career profile — skills, experience, and goals.")

    st.markdown("#### 📄 Resume Review")
    st.write("Paste your resume and get instant AI feedback from IBM Granite.")

with col2:
    st.markdown("#### 💼 Career Guidance")
    st.write("Ask any career question and get personalised mentoring advice.")

    st.markdown("#### 🎤 Interview Prep")
    st.write("Generate role-specific interview questions with expert tips.")

st.markdown("#### 🔍 Job Match")
st.write("Browse sample job listings and see how well your profile matches each role.")

st.divider()
st.caption("Built with Python · Streamlit · IBM watsonx.ai (Granite) · IBM Cloud")
