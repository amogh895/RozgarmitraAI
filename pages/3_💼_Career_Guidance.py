"""
pages/3_💼_Career_Guidance.py
Conversational career mentoring powered by IBM Granite.
"""

import uuid
import streamlit as st
from utils.watsonx_client import generate
from utils.prompts import career_guidance_prompt
from utils.data_store import load_profile, append_message, load_history

st.set_page_config(page_title="Career Guidance – RozgarMitra AI", page_icon="💼", layout="centered")

# ── Session ───────────────────────────────────────────────────────────────────
if "session_id" not in st.session_state:
    st.session_state["session_id"] = str(uuid.uuid4())
session_id = st.session_state["session_id"]

profile = load_profile(session_id)

st.title("💼 Career Guidance")
st.caption("Ask me anything about your career. I'll give you personalised, practical advice.")

if not profile:
    st.info("👤 Complete your profile first for more personalised advice.")

# ── Chat history display ──────────────────────────────────────────────────────
history = load_history(session_id)
for msg in history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# ── Input ─────────────────────────────────────────────────────────────────────
question = st.chat_input("Ask a career question…")

if question:
    # Display user message
    with st.chat_message("user"):
        st.markdown(question)
    append_message(session_id, "user", question)

    # Generate assistant reply
    with st.chat_message("assistant"):
        with st.spinner("Thinking…"):
            try:
                prompt = career_guidance_prompt(profile, question)
                answer = generate(prompt)
                st.markdown(answer)
                append_message(session_id, "assistant", answer)
            except EnvironmentError as e:
                st.error(f"Configuration error: {e}")
            except Exception as e:
                st.error(f"Something went wrong: {e}")

# ── Clear history ─────────────────────────────────────────────────────────────
if history and st.button("🗑️ Clear chat history"):
    from utils.data_store import clear_history
    clear_history(session_id)
    st.rerun()
