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
    <div style="
        background: linear-gradient(135deg, #1a56db 0%, #0f3460 60%, #16213e 100%);
        border-radius: 14px;
        padding: 1.4rem 1rem 1.2rem 1rem;
        text-align: center;
        margin-bottom: 0.6rem;
        box-shadow: 0 4px 18px rgba(26,86,219,0.16);
    ">
        <div style="font-size:2.4rem; margin-bottom:0.2rem;">🤖</div>
        <h2 style="font-size:1.8rem; font-weight:900; color:#ffffff; margin:0 0 0.25rem 0;">
            RozgarMitra AI Job Mentor
        </h2>
        <p style="color:#c7d8ff; font-size:0.95rem; margin:0;">{t("agent_subtitle", lang)}</p>
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
