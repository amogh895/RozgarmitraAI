"""
utils/prompts.py
----------------
Centralised prompt templates for every feature.
Each function returns a fully-formed prompt string ready for IBM Granite.
"""


def resume_review_prompt(resume_text: str, job_description: str = "") -> str:
    jd_section = (
        f"\n\nTarget Job Description:\n{job_description}" if job_description.strip() else ""
    )
    return (
        "You are an expert career coach and resume reviewer.\n"
        "Review the resume below and provide:\n"
        "1. An overall quality score (1-10) with a one-line justification.\n"
        "2. Three concrete strengths.\n"
        "3. Three specific, actionable improvements.\n"
        "4. A revised professional summary (2-3 sentences).\n"
        f"{jd_section}\n\n"
        f"Resume:\n{resume_text}\n\n"
        "Respond in clear, structured plain text."
    )


def career_guidance_prompt(profile: dict, question: str) -> str:
    profile_summary = (
        f"Name: {profile.get('name', 'User')}\n"
        f"Current Role: {profile.get('current_role', 'Not specified')}\n"
        f"Skills: {', '.join(profile.get('skills', [])) or 'Not specified'}\n"
        f"Experience (years): {profile.get('experience_years', 'Unknown')}\n"
        f"Career Goal: {profile.get('career_goal', 'Not specified')}"
    )
    return (
        "You are RozgarMitra AI, a friendly and knowledgeable career mentor.\n"
        f"User profile:\n{profile_summary}\n\n"
        f"User question: {question}\n\n"
        "Give a practical, specific, and encouraging answer in 3-5 sentences. "
        "If relevant, suggest 1-2 concrete next steps."
    )


def interview_prep_prompt(job_role: str, skills: list[str], question_count: int = 5) -> str:
    skills_str = ", ".join(skills) if skills else "general"
    return (
        f"You are a senior interviewer preparing a candidate for a {job_role} role.\n"
        f"The candidate's key skills are: {skills_str}.\n\n"
        f"Generate exactly {question_count} interview questions. "
        "Mix behavioural (STAR-format) and technical questions. "
        "After each question, provide a brief tip on what a strong answer should cover.\n\n"
        "Format:\nQ1. <question>\nTip: <tip>\n\nQ2. ..."
    )


def job_match_prompt(profile: dict, job_listing: str) -> str:
    skills_str = ", ".join(profile.get("skills", [])) or "Not specified"
    return (
        "You are a job-fit analyst.\n"
        f"Candidate skills: {skills_str}\n"
        f"Experience: {profile.get('experience_years', '?')} years\n"
        f"Career goal: {profile.get('career_goal', 'Not specified')}\n\n"
        f"Job listing:\n{job_listing}\n\n"
        "Provide:\n"
        "1. Match score (0-100%) with a 1-line reason.\n"
        "2. Skill gaps (bullet list).\n"
        "3. Two things the candidate should highlight in their application."
    )
