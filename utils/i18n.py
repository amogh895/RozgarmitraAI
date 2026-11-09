"""
utils/i18n.py
--------------
UI string translations for English and Hindi.
All pages import `t()` to get the right string based on session language.
"""

import streamlit as st

STRINGS = {
    # ── App-wide ─────────────────────────────────────────────────────────────
    "app_title":        {"en": "🎯 RozgarMitra AI", "hi": "🎯 रोजगारमित्र AI"},
    "app_tagline":      {"en": "Your AI-Powered Job & Career Mentor",
                         "hi": "आपका AI जॉब और करियर सलाहकार"},
    "powered_by":       {"en": "Powered by IBM Granite on IBM watsonx.ai",
                         "hi": "IBM Granite और IBM watsonx.ai द्वारा संचालित"},
    "lang_toggle_label":{"en": "🌐 Language / भाषा", "hi": "🌐 Language / भाषा"},
    "built_with":       {"en": "Built with Python · Streamlit · IBM watsonx.ai (Granite) · IBM Cloud",
                         "hi": "Python · Streamlit · IBM watsonx.ai (Granite) · IBM Cloud के साथ बना"},

    # ── Sidebar nav ──────────────────────────────────────────────────────────
    "nav_hint":         {"en": "Use the **pages** above to navigate:\n\n"
                               "- 🤖 AI Job Mentor\n- 👤 My Profile\n- 📄 Resume Review\n"
                               "- 🎤 Interview Prep",
                         "hi": "ऊपर दिए **pages** पर जाएं:\n\n"
                               "- 🤖 AI जॉब मेंटर\n- 👤 मेरी प्रोफ़ाइल\n- 📄 रिज्यूमे समीक्षा\n"
                               "- 🎤 इंटरव्यू तैयारी"},

    # ── AI Agent page ─────────────────────────────────────────────────────────
    "agent_page_title": {"en": "🤖 RozgarMitra AI Job Mentor",
                         "hi": "🤖 रोजगारमित्र AI जॉब मेंटर"},
    "agent_subtitle":   {"en": "Ask me anything about jobs, careers, resumes, interviews, or salaries.",
                         "hi": "नौकरी, करियर, रिज्यूमे, इंटरव्यू या सैलरी के बारे में कुछ भी पूछें।"},
    "agent_welcome":    {"en": "I'm **RozgarMitra AI Job Mentor**, powered by IBM Granite on IBM watsonx.ai.\n\n"
                               "I can help you with:\n"
                               "- 💼 Career path advice & job search tips\n"
                               "- 📄 Resume & cover letter guidance\n"
                               "- 🎤 Interview preparation & mock questions\n"
                               "- 💰 Salary negotiation strategies\n"
                               "- 📈 Skill development & learning roadmaps\n"
                               "- 🏛️ Government job schemes & welfare programmes\n\n"
                               "Click a suggested question or type your own!",
                         "hi": "मैं **रोजगारमित्र AI जॉब मेंटर** हूं, IBM Granite द्वारा संचालित।\n\n"
                               "मैं आपकी इन चीज़ों में मदद कर सकता हूं:\n"
                               "- 💼 करियर सलाह और नौकरी खोजने के तरीके\n"
                               "- 📄 रिज्यूमे और कवर लेटर बनाना\n"
                               "- 🎤 इंटरव्यू की तैयारी और प्रश्न\n"
                               "- 💰 सैलरी बातचीत के तरीके\n"
                               "- 📈 नए कौशल सीखने का रास्ता\n"
                               "- 🏛️ सरकारी योजनाएं और रोजगार कार्यक्रम\n\n"
                               "नीचे कोई सवाल चुनें या खुद लिखें!"},
    "agent_suggestions_label": {"en": "**💡 Try asking:**", "hi": "**💡 ये सवाल पूछ सकते हैं:**"},
    "agent_suggestions": {
        "en": [
            "How do I find a government job in India?",
            "What is PM Kaushal Vikas Yojana and how to apply?",
            "How do I write a resume with no experience?",
            "What blue-collar jobs pay well in India?",
            "How do I register on the NCS (National Career Service) portal?",
            "What skills should I learn for a better-paying job?",
        ],
        "hi": [
            "सरकारी नौकरी कैसे मिलेगी?",
            "PM Kaushal Vikas Yojana क्या है और कैसे आवेदन करें?",
            "बिना अनुभव के रिज्यूमे कैसे बनाएं?",
            "भारत में कौन से काम में अच्छी कमाई होती है?",
            "NCS पोर्टल पर रजिस्ट्रेशन कैसे करें?",
            "बेहतर नौकरी के लिए कौन सा कौशल सीखें?",
        ],
    },
    "agent_chat_placeholder": {"en": "Ask a career or job question…",
                                "hi": "नौकरी या करियर से जुड़ा सवाल पूछें…"},
    "agent_thinking":   {"en": "RozgarMitra AI is thinking…",
                         "hi": "रोजगारमित्र AI सोच रहा है…"},
    "agent_clear":      {"en": "🗑️ Clear conversation", "hi": "🗑️ बातचीत साफ़ करें"},
    "agent_disclaimer": {"en": "⚠️ **Disclaimer:** RozgarMitra AI Job Mentor is strictly limited to career, "
                               "job search, resume, interview, salary, and skill development topics. "
                               "It does not provide legal, financial, medical, or personal advice. "
                               "AI responses may not always be accurate — verify important information "
                               "from official sources. Powered by **IBM Granite** on **IBM watsonx.ai**.",
                         "hi": "⚠️ **अस्वीकरण:** रोजगारमित्र AI केवल करियर, नौकरी खोज, रिज्यूमे, इंटरव्यू, "
                               "सैलरी और कौशल विकास के विषयों तक सीमित है। यह कानूनी, वित्तीय, चिकित्सा "
                               "या व्यक्तिगत सलाह नहीं देता। AI उत्तर हमेशा सटीक नहीं हो सकते — "
                               "महत्वपूर्ण जानकारी को आधिकारिक स्रोतों से सत्यापित करें।"},

    # ── Profile page ──────────────────────────────────────────────────────────
    "profile_title":    {"en": "👤 My Profile", "hi": "👤 मेरी प्रोफ़ाइल"},
    "profile_caption":  {"en": "Your profile helps the AI give you personalised answers.",
                         "hi": "आपकी प्रोफ़ाइल AI को व्यक्तिगत जवाब देने में मदद करती है।"},
    "profile_name":     {"en": "Full Name", "hi": "पूरा नाम"},
    "profile_role":     {"en": "Current Job / Trade", "hi": "वर्तमान नौकरी / काम"},
    "profile_exp":      {"en": "Years of Work Experience", "hi": "काम का अनुभव (साल में)"},
    "profile_skills":   {"en": "Skills (comma-separated)", "hi": "कौशल (कॉमा से अलग करें)"},
    "profile_skills_ph":{"en": "e.g. Electrician, Welding, Driving, Computer",
                         "hi": "जैसे: इलेक्ट्रीशियन, वेल्डिंग, ड्राइविंग, कंप्यूटर"},
    "profile_goal":     {"en": "Career Goal", "hi": "करियर लक्ष्य"},
    "profile_goal_ph":  {"en": "e.g. Get a stable government job, learn new trade",
                         "hi": "जैसे: सरकारी नौकरी मिले, नया काम सीखना है"},
    "profile_save":     {"en": "💾 Save Profile", "hi": "💾 प्रोफ़ाइल सेव करें"},
    "profile_saved_ok": {"en": "Profile saved! ✅ You can now use all features.",
                         "hi": "प्रोफ़ाइल सेव हो गई! ✅ अब सभी सुविधाएं उपयोग करें।"},
    "profile_view":     {"en": "Saved Profile", "hi": "सेव हुई प्रोफ़ाइल"},

    # ── Resume Review ─────────────────────────────────────────────────────────
    "resume_title":     {"en": "📄 Resume Review", "hi": "📄 रिज्यूमे समीक्षा"},
    "resume_caption":   {"en": "Paste your resume. IBM Granite will score it and suggest improvements.",
                         "hi": "अपना रिज्यूमे यहाँ डालें। IBM Granite उसे स्कोर करेगा और सुधार सुझाएगा।"},
    "resume_input_label":{"en":"Your Resume", "hi": "आपका रिज्यूमे"},
    "resume_input_ph":  {"en": "Paste the full text of your resume here…",
                         "hi": "यहाँ अपना पूरा रिज्यूमे डालें…"},
    "resume_jd_label":  {"en": "Target Job Description (optional)",
                         "hi": "नौकरी का विवरण (वैकल्पिक)"},
    "resume_jd_ph":     {"en": "Paste the job description to get tailored feedback…",
                         "hi": "नौकरी का विवरण डालें तो बेहतर सुझाव मिलेगा…"},
    "resume_btn":       {"en": "🔍 Review My Resume", "hi": "🔍 मेरा रिज्यूमे देखें"},
    "resume_warn":      {"en": "Please paste your resume text first.",
                         "hi": "पहले अपना रिज्यूमे डालें।"},
    "resume_spinner":   {"en": "IBM Granite is reviewing your resume…",
                         "hi": "IBM Granite आपका रिज्यूमे देख रहा है…"},
    "resume_result_hdr":{"en": "AI Feedback", "hi": "AI की प्रतिक्रिया"},

    # ── Career Guidance ───────────────────────────────────────────────────────
    "guidance_title":   {"en": "💼 Career Guidance", "hi": "💼 करियर मार्गदर्शन"},
    "guidance_caption": {"en": "Ask me anything about your career. I'll give you personalised advice.",
                         "hi": "अपने करियर के बारे में कुछ भी पूछें। मैं व्यक्तिगत सलाह दूंगा।"},
    "guidance_no_profile":{"en":"👤 Complete your profile first for more personalised advice.",
                          "hi": "👤 बेहतर सलाह के लिए पहले अपनी प्रोफ़ाइल बनाएं।"},
    "guidance_placeholder":{"en":"Ask a career question…", "hi":"करियर से जुड़ा सवाल पूछें…"},
    "guidance_thinking":{"en": "Thinking…", "hi": "सोच रहा हूं…"},
    "guidance_clear":   {"en": "🗑️ Clear chat history", "hi": "🗑️ चैट इतिहास साफ़ करें"},

    # ── Interview Prep ────────────────────────────────────────────────────────
    "interview_title":  {"en": "🎤 Interview Prep", "hi": "🎤 इंटरव्यू तैयारी"},
    "interview_caption":{"en": "Get AI-generated interview questions tailored to your role.",
                         "hi": "अपनी नौकरी के लिए AI से इंटरव्यू प्रश्न पाएं।"},
    "interview_role_label":{"en":"Target Job Role", "hi":"लक्षित नौकरी"},
    "interview_role_ph":{"en": "e.g. Data Scientist, Electrician, Sales Executive",
                         "hi": "जैसे: डेटा साइंटिस्ट, इलेक्ट्रीशियन, सेल्स एग्जीक्यूटिव"},
    "interview_skills_label":{"en":"Key Skills (comma-separated)", "hi":"मुख्य कौशल (कॉमा से अलग करें)"},
    "interview_count":  {"en": "Number of questions", "hi": "प्रश्नों की संख्या"},
    "interview_btn":    {"en": "🎯 Generate Questions", "hi": "🎯 प्रश्न बनाएं"},
    "interview_warn":   {"en": "Please enter a target job role.", "hi": "कृपया नौकरी का नाम डालें।"},
    "interview_spinner":{"en": "IBM Granite is preparing your questions…",
                         "hi": "IBM Granite आपके प्रश्न तैयार कर रहा है…"},
    "interview_result_hdr":{"en":"Interview Questions & Tips", "hi":"इंटरव्यू प्रश्न और सुझाव"},

    # ── Job Match ─────────────────────────────────────────────────────────────
    "jobmatch_title":   {"en": "🔍 Job Match", "hi": "🔍 जॉब मिलान"},
    "jobmatch_caption": {"en": "Select a job and see how well your profile fits.",
                         "hi": "नौकरी चुनें और देखें आपकी प्रोफ़ाइल कितनी उपयुक्त है।"},
    "jobmatch_no_profile":{"en":"👤 Complete your profile first to get a personalised match score.",
                           "hi":"👤 मिलान स्कोर के लिए पहले प्रोफ़ाइल बनाएं।"},
    "jobmatch_select":  {"en": "Choose a job listing", "hi": "नौकरी चुनें"},
    "jobmatch_btn":     {"en": "⚡ Analyse My Fit", "hi": "⚡ मेरा मिलान देखें"},
    "jobmatch_warn":    {"en": "Please save your profile before running a match analysis.",
                         "hi": "मिलान से पहले अपनी प्रोफ़ाइल सेव करें।"},
    "jobmatch_spinner": {"en": "IBM Granite is analysing your fit…",
                         "hi": "IBM Granite आपका मिलान देख रहा है…"},
    "jobmatch_result_hdr":{"en":"Match Analysis", "hi":"मिलान विश्लेषण"},

    # ── Common ────────────────────────────────────────────────────────────────
    "profile_tip":      {"en": "💡 Tip: Complete your **👤 My Profile** for more personalised answers.",
                         "hi": "💡 सुझाव: बेहतर जवाब के लिए **👤 मेरी प्रोफ़ाइल** बनाएं।"},
    "config_error":     {"en": "⚠️ Configuration error: ", "hi": "⚠️ सेटिंग में गड़बड़ी: "},
    "generic_error":    {"en": "⚠️ Something went wrong: ", "hi": "⚠️ कुछ गलत हो गया: "},

    # ── Landing page feature cards ────────────────────────────────────────────
    "more_features":    {"en": "### ✨ More Features", "hi": "### ✨ और सुविधाएं"},
    "feat_profile":     {"en": "**👤 My Profile**", "hi": "**👤 मेरी प्रोफ़ाइल**"},
    "feat_profile_desc":{"en": "Save your skills, experience, and goals for personalised AI responses.",
                         "hi": "अपना काम, अनुभव और लक्ष्य सेव करें — AI बेहतर जवाब देगा।"},
    "feat_resume":      {"en": "**📄 Resume Review**", "hi": "**📄 रिज्यूमे समीक्षा**"},
    "feat_resume_desc": {"en": "Get an AI score, strengths, and actionable improvements on your resume.",
                         "hi": "अपने रिज्यूमे पर AI से स्कोर, खूबियां और सुधार पाएं।"},
    "feat_interview":   {"en": "**🎤 Interview Prep**", "hi": "**🎤 इंटरव्यू तैयारी**"},
    "feat_interview_desc":{"en":"Generate role-specific interview questions with expert tips.",
                           "hi":"अपनी नौकरी के लिए इंटरव्यू प्रश्न और सुझाव पाएं।"},
    "feat_jobmatch":    {"en": "**🔍 Job Match**", "hi": "**🔍 जॉब मिलान**"},
    "feat_jobmatch_desc":{"en":"See how well your profile fits sample job listings.",
                          "hi":"देखें आपकी प्रोफ़ाइल नौकरी के लिए कितनी उपयुक्त है।"},
    "landing_disclaimer":{"en":"⚠️ **Disclaimer:** RozgarMitra AI Job Mentor is strictly limited to career, "
                               "job search, resume, interview, salary, and skill development topics. "
                               "It does not provide legal, financial, medical, or personal advice. "
                               "AI responses may not always be accurate — verify important information "
                               "from official sources.",
                          "hi":"⚠️ **अस्वीकरण:** रोजगारमित्र AI केवल करियर, नौकरी, रिज्यूमे, इंटरव्यू, "
                               "सैलरी और कौशल के विषयों तक सीमित है। यह कानूनी, वित्तीय या चिकित्सा "
                               "सलाह नहीं देता। AI उत्तर हमेशा सटीक नहीं हो सकते।"},
}


def t(key: str, lang: str) -> str:
    """Return translated string for key in given language. Falls back to English."""
    entry = STRINGS.get(key, {})
    return entry.get(lang, entry.get("en", key))


def lang_selector() -> str:
    """
    Render a language toggle in the sidebar.
    Returns the selected language code: 'en' or 'hi'.
    """
    if "lang" not in st.session_state:
        st.session_state["lang"] = "en"

    choice = st.sidebar.radio(
        "🌐 Language / भाषा",
        options=["English", "हिंदी"],
        index=0 if st.session_state["lang"] == "en" else 1,
        horizontal=True,
        key="lang_radio",
    )
    lang = "hi" if choice == "हिंदी" else "en"
    st.session_state["lang"] = lang
    return lang


