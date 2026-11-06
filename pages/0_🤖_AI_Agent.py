"""
pages/0_🤖_AI_Agent.py
Free-form conversational AI agent powered by IBM Granite on watsonx.ai.
Users can ask anything career-related and get real-time responses.
"""

import uuid
import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import agent_prompt
from utils.data_store import load_profile, append_message, load_history, clear_history

st.set_page_config(
    page_title="AI Agent – RozgarMitra AI",
    page_icon="🤖",
    layout="centered",
)

# ── Session ───────────────────────────────────────────────────────────────────
if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]

# Use a separate key so agent history is independent of career guidance history
AGENT_SESSION = f"agent_{session_id}"

profile = load_profile(session_id)

# ── Header ────────────────────────────────────────────────────────────────────
st.title("🤖 AI Agent")
st.caption("Ask me anything about your career — I'll give you instant, personalised answers.")

if not profile:
    st.info("💡 Tip: Complete your **👤 My Profile** first for more personalised answers.")

# ── Chat history display ──────────────────────────────────────────────────────
history = load_history(AGENT_SESSION)

for msg in history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# ── Input ─────────────────────────────────────────────────────────────────────
user_input = st.chat_input("Ask anything… e.g. How do I negotiate a salary raise?")

if user_input:
    # Show user message immediately
    with st.chat_message("user"):
        st.markdown(user_input)
    append_message(AGENT_SESSION, "user", user_input)

    # Reload history (includes the message just appended) for context
    history = load_history(AGENT_SESSION)

    # Generate response
    with st.chat_message("assistant"):
        with st.spinner("IBM Granite is thinking…"):
            try:
                prompt = agent_prompt(profile, history[:-1], user_input)
                reply = generate(prompt)
                # Strip echoed "Assistant:" prefix if model includes it
                if reply.startswith("Assistant:"):
                    reply = reply[len("Assistant:"):].strip()
                st.markdown(reply)
                append_message(AGENT_SESSION, "assistant", reply)
            except EnvironmentError as e:
                st.error(f"⚠️ Configuration error: {e}")
            except Exception as e:
                st.error(f"⚠️ Something went wrong: {e}")

# ── Sidebar controls ──────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("---")
    if history:
        if st.button("🗑️ Clear conversation"):
            clear_history(AGENT_SESSION)
            st.rerun()
    st.caption("Powered by **IBM Granite** on **IBM watsonx.ai**")
