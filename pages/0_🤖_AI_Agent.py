"""
pages/0_🤖_AI_Agent.py
RozgarMitra AI Job Mentor – multilingual, guardrailed, informal-worker-friendly chat.
"""

import uuid
import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import agent_prompt
from utils.data_store import load_profile, append_message, load_history, clear_history
from utils.i18n import t, lang_selector

st.set_page_config(
    page_title="RozgarMitra AI Job Mentor",
    page_icon="🤖",
    layout="centered",
)

if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]
AGENT_SESSION = f"agent_{session_id}"

profile = load_profile(session_id)

# Language selector in sidebar
lang = lang_selector()
with st.sidebar:
    st.markdown("---")
    if load_history(AGENT_SESSION):
        if st.button(t("agent_clear", lang)):
            from utils.data_store import clear_history
            clear_history(AGENT_SESSION)
            st.rerun()
    st.caption(t("powered_by", lang))

# Header
st.markdown(
    f"""
    <div style="text-align:center; padding:1.2rem 0 0.4rem 0;">
        <h2 style="font-size:1.9rem; font-weight:800; color:#1a1a2e; margin-bottom:0.2rem;">
            {t("agent_page_title", lang)}
        </h2>
        <p style="color:#555; font-size:1rem; margin:0;">{t("agent_subtitle", lang)}</p>
    </div>
    """,
    unsafe_allow_html=True,
)

history = load_history(AGENT_SESSION)

if not history:
    name = profile.get("name", "") if profile else ""
    greeting = (f"नमस्ते {name}! 🙏" if name else "नमस्ते! 🙏") if lang == "hi" else (f"Hello {name}! 👋" if name else "Hello! 👋")
    st.success(f"{greeting}\n\n{t('agent_welcome', lang)}")

    st.markdown(t("agent_suggestions_label", lang))
    suggestions = t("agent_suggestions", lang)
    cols = st.columns(2)
    for i, q in enumerate(suggestions):
        if cols[i % 2].button(q, key=f"suggestion_{i}", use_container_width=True):
            st.session_state["prefill_question"] = q
            st.rerun()

if not profile:
    st.info(t("profile_tip", lang))

for msg in history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

prefill = st.session_state.pop("prefill_question", None)
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

st.divider()
st.caption(t("agent_disclaimer", lang))
