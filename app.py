"""
app.py  –  RozgarMitra AI
Landing page with embedded multilingual AI Job Mentor chat.
"""

import uuid
import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import agent_prompt
from utils.data_store import load_profile, append_message, load_history, clear_history
from utils.i18n import t, lang_selector

st.set_page_config(
    page_title="RozgarMitra AI",
    page_icon="🎯",
    layout="centered",
    initial_sidebar_state="expanded",
)

# ── Session ───────────────────────────────────────────────────────────────────
if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]
AGENT_SESSION = f"agent_{session_id}"

profile = load_profile(session_id)

# ── Sidebar ───────────────────────────────────────────────────────────────────
st.sidebar.title("🎯 RozgarMitra AI")
st.sidebar.caption("Your AI-Powered Job & Career Mentor")
lang = lang_selector()
st.sidebar.markdown("---")
st.sidebar.info(t("nav_hint", lang))

# ── Hero ──────────────────────────────────────────────────────────────────────
st.markdown(
    f"""
    <div style="text-align:center; padding:1.5rem 0 0.5rem 0;">
        <h1 style="font-size:2.4rem; font-weight:800; color:#1a1a2e; margin-bottom:0.3rem;">
            {t("app_title", lang)}
        </h1>
        <p style="font-size:1.1rem; color:#555; margin:0;">{t("app_tagline", lang)}</p>
        <p style="font-size:0.9rem; color:#888; margin-top:0.3rem;">
            {t("powered_by", lang)}
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

st.divider()

# ════════════════════════════════════════════════════════════════════
#   EMBEDDED AI JOB MENTOR CHAT
# ════════════════════════════════════════════════════════════════════
st.markdown(
    f"<h3 style='text-align:center; color:#1a1a2e;'>{t('agent_page_title', lang)}</h3>",
    unsafe_allow_html=True,
)
st.caption(t("agent_subtitle", lang))

history = load_history(AGENT_SESSION)

# Welcome banner — shown only when chat is empty
if not history:
    name = profile.get("name", "") if profile else ""
    greeting = (f"नमस्ते {name}! 🙏" if name else "नमस्ते! 🙏") if lang == "hi" else (f"Hello {name}! 👋" if name else "Hello! 👋")
    st.success(f"{greeting}\n\n{t('agent_welcome', lang)}")

    st.markdown(t("agent_suggestions_label", lang))
    suggestions = t("agent_suggestions", lang)
    cols = st.columns(2)
    for i, q in enumerate(suggestions):
        if cols[i % 2].button(q, key=f"home_suggestion_{i}", use_container_width=True):
            st.session_state["home_prefill"] = q
            st.rerun()

if not profile:
    st.info(t("profile_tip", lang))

# Chat history
for msg in history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

prefill = st.session_state.pop("home_prefill", None)
user_input = st.chat_input(t("agent_chat_placeholder", lang)) or prefill

if user_input:
    with st.chat_message("user"):
        st.markdown(user_input)
    append_message(AGENT_SESSION, "user", user_input)
    history = load_history(AGENT_SESSION)

    with st.chat_message("assistant"):
        with st.spinner(t("agent_thinking", lang)):
            try:
                prompt = agent_prompt(profile, history[:-1], user_input, lang=lang)
                reply = generate(prompt)
                if reply.startswith("Assistant:"):
                    reply = reply[len("Assistant:"):].strip()
                st.markdown(reply)
                append_message(AGENT_SESSION, "assistant", reply)
            except EnvironmentError as e:
                st.error(f"{t('config_error', lang)}{e}")
            except Exception as e:
                st.error(f"{t('generic_error', lang)}{e}")

if history:
    if st.button(t("agent_clear", lang), key="home_clear"):
        clear_history(AGENT_SESSION)
        st.rerun()

# ── Disclaimer ────────────────────────────────────────────────────────────────
st.divider()
st.caption(t("landing_disclaimer", lang))

# ── Feature overview ──────────────────────────────────────────────────────────
st.divider()
st.markdown(t("more_features", lang))
col1, col2 = st.columns(2)
with col1:
    st.markdown(t("feat_profile", lang))
    st.write(t("feat_profile_desc", lang))
    st.markdown(t("feat_resume", lang))
    st.write(t("feat_resume_desc", lang))
with col2:
    st.markdown(t("feat_interview", lang))
    st.write(t("feat_interview_desc", lang))
    st.markdown(t("feat_jobmatch", lang))
    st.write(t("feat_jobmatch_desc", lang))

st.divider()
st.caption(t("built_with", lang))
