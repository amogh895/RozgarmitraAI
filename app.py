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
    <div style="
        background: linear-gradient(135deg, #1a56db 0%, #0f3460 60%, #16213e 100%);
        border-radius: 16px;
        padding: 2.2rem 1rem 1.8rem 1rem;
        text-align: center;
        margin-bottom: 0.5rem;
        box-shadow: 0 4px 24px rgba(26,86,219,0.18);
    ">
        <div style="font-size:3.2rem; margin-bottom:0.4rem;">🎯</div>
        <h1 style="font-size:2.4rem; font-weight:900; color:#ffffff; margin:0 0 0.3rem 0; letter-spacing:-0.5px;">
            RozgarMitra AI
        </h1>
        <p style="font-size:1.1rem; color:#c7d8ff; margin:0 0 0.5rem 0; font-weight:500;">
            {t("app_tagline", lang)}
        </p>
        <span style="
            display:inline-block;
            background:rgba(255,255,255,0.15);
            border-radius:20px;
            padding:0.25rem 1rem;
            font-size:0.8rem;
            color:#e0eaff;
        ">⚡ {t("powered_by", lang)}</span>
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
with col2:
    st.markdown(t("feat_resume", lang))
    st.write(t("feat_resume_desc", lang))

col3, col4 = st.columns(2)
with col3:
    st.markdown(t("feat_interview", lang))
    st.write(t("feat_interview_desc", lang))

st.divider()
st.caption(t("built_with", lang))
