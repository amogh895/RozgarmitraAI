"""
generate_pptx.py
----------------
Generates the formal 12-slide PowerPoint presentation matching the
IBM University Engagement Project Submission template:
"Exploring the Power of Agentic AI with IBM Granite and LangFlow"
for the RozgarMitra AI project.

Run this script on your machine:
    pip install python-pptx
    python generate_pptx.py
"""

import sys

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.enum.text import PP_ALIGN
    from pptx.dml.color import RGBColor
    from pptx.enum.shapes import MSO_SHAPE
except ImportError:
    print("\n[!] 'python-pptx' is not installed.")
    print("Please install it by running:")
    print("    pip install python-pptx")
    print("Then re-run: python generate_pptx.py\n")
    sys.exit(1)


def build_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)  # 16:9 Widescreen
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Colors
    c_navy = RGBColor(0, 29, 108)       # #001d6c
    c_blue = RGBColor(15, 98, 254)      # #0f62fe
    c_dark = RGBColor(22, 22, 22)       # #161616
    c_white = RGBColor(255, 255, 255)
    c_gray_bg = RGBColor(244, 244, 244)
    c_card_bg = RGBColor(249, 250, 251)
    c_border = RGBColor(224, 224, 224)
    c_teal = RGBColor(0, 114, 195)
    c_purple = RGBColor(138, 63, 252)
    c_green = RGBColor(36, 161, 72)
    c_red = RGBColor(218, 30, 40)

    def add_header(slide, title_text, badge_text=""):
        # Header background
        header_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.2)
        )
        header_shape.fill.solid()
        header_shape.fill.fore_color.rgb = c_gray_bg
        header_shape.line.color.rgb = c_border
        header_shape.line.width = Pt(1.5)

        # Title text
        tx_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.18), Inches(9.5), Inches(0.85))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = "Arial"
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = c_navy

        # Badge text
        if badge_text:
            badge = slide.shapes.add_shape(
                MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.2), Inches(0.35), Inches(2.6), Inches(0.5)
            )
            badge.fill.solid()
            badge.fill.fore_color.rgb = RGBColor(237, 245, 255)
            badge.line.color.rgb = RGBColor(179, 209, 255)
            badge_tf = badge.text_frame
            bp = badge_tf.paragraphs[0]
            bp.alignment = PP_ALIGN.CENTER
            bp.text = badge_text
            bp.font.name = "Arial"
            bp.font.size = Pt(13)
            bp.font.bold = True
            bp.font.color.rgb = c_blue

    def add_footer(slide, slide_num, total=12):
        footer_box = slide.shapes.add_textbox(Inches(0.6), Inches(7.0), Inches(12.133), Inches(0.4))
        tf = footer_box.text_frame
        p = tf.paragraphs[0]
        p.text = f"RozgarMitra AI – IBM University Engagement Project Submission   |   Slide {slide_num} of {total}"
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(120, 120, 120)

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 1: Title Slide
    # ════════════════════════════════════════════════════════════════════
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = c_navy
    bg1.line.fill.background()

    # Title Banner Box
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(1.8))
    t_tf = t_box.text_frame
    t_tf.word_wrap = True
    p1 = t_tf.paragraphs[0]
    p1.text = "IBM University Engagement Project Submission"
    p1.font.name = "Arial"
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = c_white

    p2 = t_tf.add_paragraph()
    p2.text = "“Exploring the Power of Agentic AI with IBM Granite and LangFlow”"
    p2.font.name = "Arial"
    p2.font.size = Pt(22)
    p2.font.color.rgb = RGBColor(144, 202, 249)

    # Info Card
    info_card = s1.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.6), Inches(9.2), Inches(4.0)
    )
    info_card.fill.solid()
    info_card.fill.fore_color.rgb = RGBColor(10, 40, 120)
    info_card.line.color.rgb = RGBColor(40, 90, 180)

    ic_tf = info_card.text_frame
    ic_tf.word_wrap = True

    lines = [
        ("Student Name:", "Amogh Dixit"),
        ("Email ID:", "amoghdixit895@gmail.com"),
        ("Mobile number [WhatsApp]:", "+91 91515 90518"),
        ("Domain of Project:", "Career Guidance & HR Tech / Workforce Development"),
        ("Project Title:", "RozgarMitra AI – Agentic AI-Powered Job & Career Mentor"),
    ]

    for i, (k, v) in enumerate(lines):
        p = ic_tf.paragraphs[0] if i == 0 else ic_tf.add_paragraph()
        run1 = p.add_run()
        run1.text = f"{k:<28} "
        run1.font.bold = True
        run1.font.size = Pt(18)
        run1.font.color.rgb = c_white
        run1.font.name = "Arial"

        run2 = p.add_run()
        run2.text = v
        run2.font.size = Pt(18)
        run2.font.color.rgb = RGBColor(220, 235, 255)
        run2.font.name = "Arial"
        p.space_after = Pt(10)

    # Photo placeholder
    photo_box = s1.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.4), Inches(2.6), Inches(2.1), Inches(2.8)
    )
    photo_box.fill.solid()
    photo_box.fill.fore_color.rgb = RGBColor(18, 52, 140)
    photo_box.line.color.rgb = RGBColor(80, 130, 210)
    p_tf = photo_box.text_frame
    p_tf.word_wrap = True
    pp = p_tf.paragraphs[0]
    pp.alignment = PP_ALIGN.CENTER
    pp.text = "Recent\nPassport Photo\n\n[Amogh Dixit]"
    pp.font.name = "Arial"
    pp.font.size = Pt(14)
    pp.font.color.rgb = RGBColor(200, 220, 255)

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 2: Problem Statement : RozgarMitra AI
    # ════════════════════════════════════════════════════════════════════
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Problem Statement : RozgarMitra AI", "The Challenge & Objective")
    add_footer(s2, 2)

    # Left Box: The Challenge
    c_box = s2.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2)
    )
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = c_card_bg
    c_box.line.color.rgb = c_red
    c_box.line.width = Pt(2)
    ctf = c_box.text_frame
    ctf.word_wrap = True
    cp = ctf.paragraphs[0]
    cp.text = "The Challenge"
    cp.font.name = "Arial"
    cp.font.size = Pt(22)
    cp.font.bold = True
    cp.font.color.rgb = c_red
    cp.space_after = Pt(12)

    challenge_pts = [
        "Fragmented Career Guidance: Students and job seekers lack affordable access to certified career mentors.",
        "Opaque ATS Resume Filtering: Traditional systems reject resumes with binary filters without actionable feedback.",
        "Interview Preparation Void: Candidates lack role-specific STAR-methodology mock interview evaluation.",
        "Generic AI Limitations: Standard chatbots hallucinate, lose context, and drift into irrelevant non-career topics.",
    ]
    for pt in challenge_pts:
        p = ctf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(17)
        p.font.color.rgb = c_dark
        p.space_after = Pt(10)

    # Right Box: The Objective
    o_box = s2.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2)
    )
    o_box.fill.solid()
    o_box.fill.fore_color.rgb = c_card_bg
    o_box.line.color.rgb = c_green
    o_box.line.width = Pt(2)
    otf = o_box.text_frame
    otf.word_wrap = True
    op = otf.paragraphs[0]
    op.text = "The Objective"
    op.font.name = "Arial"
    op.font.size = Pt(22)
    op.font.bold = True
    op.font.color.rgb = c_green
    op.space_after = Pt(12)

    objective_pts = [
        "Personalized Career Profiles: Dynamic tracking of skills, experience, and aspirations in a persistent context store.",
        "Contextual Resume Review: Calibrated 1-10 scoring with 3 concrete strengths and 3 actionable improvements.",
        "STAR Interview Simulator: Dynamic synthesis of behavioral and technical questions with expert evaluation tips.",
        "Semantic Job-Fit Scoring: Instant match percentages and clear skill-gap identification against target roles.",
        "Multi-Agent Orchestration: Autonomous coordination of specialized agents via IBM Granite on IBM watsonx.ai.",
    ]
    for pt in objective_pts:
        p = otf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(17)
        p.font.color.rgb = c_dark
        p.space_after = Pt(10)

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 3: Proposed Solution
    # ════════════════════════════════════════════════════════════════════
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Proposed Solution : AI-Powered Career & Job Mentor", "Proposed Solution")
    add_footer(s3, 3)

    desc_box = s3.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.7), Inches(1.0))
    dtf = desc_box.text_frame
    dtf.word_wrap = True
    dp = dtf.paragraphs[0]
    dp.text = (
        "The proposed solution is an Agentic AI Career Mentorship ecosystem built using LangFlow, "
        "IBM watsonx.ai, and IBM Granite Models (ibm/granite-3-8b-instruct) to deliver personalized, "
        "real-time professional coaching and job-fit analysis through specialized intelligent agents."
    )
    dp.font.name = "Arial"
    dp.font.size = Pt(19)
    dp.font.color.rgb = c_dark

    agents = [
        ("Candidate Profiling Agent", "Maintains candidate competencies, years of experience, and target roles in persistent session storage."),
        ("Resume Evaluator Agent", "Performs semantic analysis on resumes against job descriptions, outputting calibrated scores and rewrites."),
        ("Interview Coach Agent", "Synthesizes role-specific behavioral (STAR) and technical questions paired with expert scoring tips."),
        ("Job-Fit & Gap Analysis Agent", "Calculates applicant-job semantic alignment, pinpointing missing skills and application talking points."),
        ("Career Guidance Agent", "Provides conversational mentorship strictly scoped to career growth via deterministic domain guardrails."),
    ]

    for i, (name, desc) in enumerate(agents):
        x = Inches(0.8 + (i % 3) * 3.95) if i < 3 else Inches(0.8 + ((i - 3) * 5.95))
        y = Inches(2.6) if i < 3 else Inches(4.8)
        w = Inches(3.8) if i < 3 else Inches(5.8)
        h = Inches(1.9)

        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        box.fill.solid()
        box.fill.fore_color.rgb = c_card_bg
        box.line.color.rgb = c_blue
        box.line.width = Pt(1.5)
        btf = box.text_frame
        btf.word_wrap = True
        bp1 = btf.paragraphs[0]
        bp1.text = name
        bp1.font.name = "Arial"
        bp1.font.size = Pt(18)
        bp1.font.bold = True
        bp1.font.color.rgb = c_navy
        bp1.space_after = Pt(4)

        bp2 = btf.add_paragraph()
        bp2.text = desc
        bp2.font.name = "Arial"
        bp2.font.size = Pt(15)
        bp2.font.color.rgb = c_dark

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 4: Technology Used
    # ════════════════════════════════════════════════════════════════════
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Technology Used", "Tech Stack")
    add_footer(s4, 4)

    # Left: Platform Technologies
    t_box1 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2))
    t_box1.fill.solid()
    t_box1.fill.fore_color.rgb = c_card_bg
    t_box1.line.color.rgb = c_blue
    t_box1.line.width = Pt(1.5)
    t1_tf = t_box1.text_frame
    t1_tf.word_wrap = True
    tp1 = t1_tf.paragraphs[0]
    tp1.text = "Core Technologies"
    tp1.font.name = "Arial"
    tp1.font.size = Pt(22)
    tp1.font.bold = True
    tp1.font.color.rgb = c_navy
    tp1.space_after = Pt(10)

    tech_items = [
        ("LangFlow Platform:", "Designs and orchestrates multi-agent prompt chains and conditional guardrail paths."),
        ("IBM Granite Model:", "ibm/granite-3-8b-instruct for high-accuracy reasoning, summarization, and dialogue."),
        ("IBM Cloud:", "Provides enterprise-grade cloud infrastructure, scalability, IAM security, and endpoint hosting."),
        ("IBM watsonx.ai:", "Scalable model inference, parameter controls (0.7 temp, 1.1 rep penalty), and governance."),
        ("Context Data Store:", "Zero-overhead JSON persistence ensuring candidate profile state across sessions."),
    ]
    for k, v in tech_items:
        p = t1_tf.add_paragraph()
        run1 = p.add_run()
        run1.text = "• " + k + " "
        run1.font.bold = True
        run1.font.size = Pt(16)
        run1.font.color.rgb = c_navy
        run2 = p.add_run()
        run2.text = v
        run2.font.size = Pt(16)
        run2.font.color.rgb = c_dark
        p.space_after = Pt(8)

    # Right: LangFlow Components
    t_box2 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2))
    t_box2.fill.solid()
    t_box2.fill.fore_color.rgb = c_card_bg
    t_box2.line.color.rgb = c_purple
    t_box2.line.width = Pt(1.5)
    t2_tf = t_box2.text_frame
    t2_tf.word_wrap = True
    tp2 = t2_tf.paragraphs[0]
    tp2.text = "LangFlow Components Used"
    tp2.font.name = "Arial"
    tp2.font.size = Pt(22)
    tp2.font.bold = True
    tp2.font.color.rgb = c_purple
    tp2.space_after = Pt(10)

    components = [
        ("1) Chat Input:", "Interface capturing candidate inquiries, resumes, and target roles."),
        ("2) watsonx AI Agent:", "Invokes Granite models with parameterized instructions."),
        ("3) Granite Model Node:", "Configured with ibm/granite-3-8b-instruct and 1024 token limit."),
        ("4) Chat Output:", "Renders structured evaluation rubrics, scores, and markdown guides."),
        ("5) File / State Component:", "Loads and persists profile metadata and session chat history."),
        ("6) Domain Guardrail Node:", "Intercepts out-of-domain prompts to ensure career relevance."),
    ]
    for k, v in components:
        p = t2_tf.add_paragraph()
        run1 = p.add_run()
        run1.text = k + " "
        run1.font.bold = True
        run1.font.size = Pt(16)
        run1.font.color.rgb = c_navy
        run2 = p.add_run()
        run2.text = v
        run2.font.size = Pt(16)
        run2.font.color.rgb = c_dark
        p.space_after = Pt(6)

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 5: LangFlow Workflow
    # ════════════════════════════════════════════════════════════════════
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "LangFlow Workflow", "Workflow Design")
    add_footer(s5, 5)

    wf_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.7), Inches(4.2))
    wf_box.fill.solid()
    wf_box.fill.fore_color.rgb = RGBColor(15, 23, 42)
    wf_box.line.color.rgb = RGBColor(51, 65, 85)
    wftf = wf_box.text_frame
    wftf.word_wrap = True
    wfp = wftf.paragraphs[0]
    wfp.text = "LangFlow Multi-Agent Visual Orchestration Pipeline"
    wfp.font.name = "Arial"
    wfp.font.size = Pt(20)
    wfp.font.bold = True
    wfp.font.color.rgb = RGBColor(96, 165, 250)
    wfp.space_after = Pt(10)

    diagram_text = (
        "[User Input: Resume / Job Description / Query]\n"
        "             │\n"
        "             ▼\n"
        "[Intent Classifier & Domain Guardrail Node]\n"
        "             ├──► Non-Career Intent ──► [Polite Redirection Output]\n"
        "             │\n"
        "             ├──► Resume Audit ────► [Resume Evaluator Agent]\n"
        "             ├──► Interview Drill ─► [Interview Coach Agent]\n"
        "             └──► Job Match ───────► [Job-Fit Analysis Agent]\n"
        "                                           │\n"
        "                                           ▼\n"
        "                        [Context Injection Node (Profile JSON)]\n"
        "                                           │\n"
        "                                           ▼\n"
        "                        [IBM watsonx.ai : Granite-3-8B-Instruct]\n"
        "                                           │\n"
        "                                           ▼\n"
        "                        [Structured Response Formatter ──► UI]"
    )
    p_diag = wftf.add_paragraph()
    p_diag.text = diagram_text
    p_diag.font.name = "Consolas"
    p_diag.font.size = Pt(14)
    p_diag.font.color.rgb = RGBColor(226, 232, 240)

    exp_box = s5.shapes.add_textbox(Inches(0.8), Inches(5.9), Inches(11.7), Inches(0.9))
    etf = exp_box.text_frame
    etf.word_wrap = True
    ep = etf.paragraphs[0]
    ep.text = (
        "✦ LangFlow enables visual routing of user inputs to specialized agent prompts, "
        "automatically injecting the candidate's persistent profile into the IBM Granite inference call."
    )
    ep.font.name = "Arial"
    ep.font.size = Pt(18)
    ep.font.color.rgb = c_navy

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 6: Architecture Blueprint
    # ════════════════════════════════════════════════════════════════════
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Architecture Blueprint", "System Architecture")
    add_footer(s6, 6)

    layers = [
        ("1. Presentation Layer (Streamlit)", "Multi-page responsive frontend: Profile management, Resume Review, Career Guidance, Interview Prep, and Job Matching."),
        ("2. Orchestration & Guardrails (LangFlow)", "Multi-agent intent dispatcher, system persona conditioning, few-shot prompt chaining, and domain guardrails."),
        ("3. Foundation Model Layer (watsonx.ai)", "IBM Granite-3-8B-Instruct via ibm-watsonx-ai SDK. Configured with 0.7 temperature, 1.1 repetition penalty."),
        ("4. Data Persistence & Context Store", "Zero-database JSON architecture storing user profiles (skills, experience, goals), sample jobs, and chat history."),
    ]

    for i, (title, content) in enumerate(layers):
        y = Inches(1.5 + i * 1.3)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(1.15))
        card.fill.solid()
        card.fill.fore_color.rgb = c_card_bg
        card.line.color.rgb = c_blue if i % 2 == 0 else c_purple
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.name = "Arial"
        cp1.font.size = Pt(18)
        cp1.font.bold = True
        cp1.font.color.rgb = c_navy
        cp1.space_after = Pt(2)
        cp2 = ctf.add_paragraph()
        cp2.text = content
        cp2.font.name = "Arial"
        cp2.font.size = Pt(15)
        cp2.font.color.rgb = c_dark

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 7: Role of Agentic AI
    # ════════════════════════════════════════════════════════════════════
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Role of Agentic AI in the Solution", "Agentic AI")
    add_footer(s7, 7)

    pillars = [
        ("Autonomous Specialization", "Deconstructs complex career planning into dedicated agent roles (Resume Evaluator, Interview Coach, Job-Fit Analyst) rather than a single unfocused model."),
        ("Context Awareness & Memory", "Persists candidate profile data across sessions and conversation turns, enabling deeply personalized coaching without repetitive user inputs."),
        ("Proactive Goal-Driven Action", "Rather than merely answering, the system proactively isolates skill deficits, suggests portfolio adjustments, and outputs concrete next steps."),
        ("Deterministic Domain Guardrails", "Autonomously detects off-topic queries (entertainment, politics) and steers the user back to professional development, ensuring reliable behavior."),
    ]

    for i, (title, desc) in enumerate(pillars):
        x = Inches(0.8 if i % 2 == 0 else 6.8)
        y = Inches(1.6 if i < 2 else 4.3)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.7), Inches(2.5))
        card.fill.solid()
        card.fill.fore_color.rgb = c_card_bg
        card.line.color.rgb = c_green if i == 0 else (c_purple if i == 1 else (c_blue if i == 2 else c_red))
        card.line.width = Pt(2)
        ctf = card.text_frame
        ctf.word_wrap = True
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.name = "Arial"
        cp1.font.size = Pt(19)
        cp1.font.bold = True
        cp1.font.color.rgb = c_navy
        cp1.space_after = Pt(6)
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.name = "Arial"
        cp2.font.size = Pt(16)
        cp2.font.color.rgb = c_dark

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 8: Token Usage
    # ════════════════════════════════════════════════════════════════════
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Token Usage & Resource Optimization", "Resource Optimization")
    add_footer(s8, 8)

    t_card1 = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2))
    t_card1.fill.solid()
    t_card1.fill.fore_color.rgb = c_card_bg
    t_card1.line.color.rgb = c_teal
    t_card1.line.width = Pt(1.5)
    t1tf = t_card1.text_frame
    t1tf.word_wrap = True
    tp1 = t1tf.paragraphs[0]
    tp1.text = "Token Metrics on IBM watsonx.ai"
    tp1.font.name = "Arial"
    tp1.font.size = Pt(22)
    tp1.font.bold = True
    tp1.font.color.rgb = c_teal
    tp1.space_after = Pt(10)

    token_pts = [
        "Foundation Model: ibm/granite-3-8b-instruct",
        "High Parameter Efficiency: 8-Billion parameter instruction model delivering high reasoning at modest token overhead.",
        "Bounded Generation: MAX_NEW_TOKENS restricted to 1,024 to prevent runaway token usage.",
        "Generous Quota Fit: Fully compliant with IBM Lite Plan offering 300,000 free tokens/month.",
    ]
    for pt in token_pts:
        p = t1tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(16)
        p.font.color.rgb = c_dark
        p.space_after = Pt(8)

    t_card2 = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2))
    t_card2.fill.solid()
    t_card2.fill.fore_color.rgb = c_card_bg
    t_card2.line.color.rgb = c_purple
    t_card2.line.width = Pt(1.5)
    t2tf = t_card2.text_frame
    t2tf.word_wrap = True
    tp2 = t2tf.paragraphs[0]
    tp2.text = "Context Window Optimization"
    tp2.font.name = "Arial"
    tp2.font.size = Pt(22)
    tp2.font.bold = True
    tp2.font.color.rgb = c_purple
    tp2.space_after = Pt(10)

    opt_pts = [
        "Sliding Context Window: Restricts chat memory to the last 6 conversational turns (~600 tokens), preventing token inflation.",
        "Targeted System Instructions: Concise few-shot prompts yield high accuracy without bloated preamble tokens.",
        "Repetition Penalty (1.1): Penalizes repetitive phrasing, reducing redundant token generation.",
        "Result: Over 70% token savings compared to naive multi-turn conversational agents.",
    ]
    for pt in opt_pts:
        p = t2tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(16)
        p.font.color.rgb = c_dark
        p.space_after = Pt(8)

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 9: Novelty and Uniqueness
    # ════════════════════════════════════════════════════════════════════
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Novelty and Uniqueness", "Value Proposition")
    add_footer(s9, 9)

    novelties = [
        ("Full-Lifecycle Mentorship", "End-to-end integration of candidate profiling, resume auditing, STAR mock interviews, and job matching in one cohesive app."),
        ("Transparent ATS Rubrics", "Replaces ambiguous rejection letters with calibrated 1-10 scores, 3 concrete strengths, and actionable improvements."),
        ("Democratized Accessibility", "Zero-database, low-compute deployment built specifically for early-career and underserved job seekers with no paid barriers."),
        ("Strict Domain Guardrails", "Autonomous redirection ensures the AI remains strictly focused on professional and career development."),
        ("IBM Granite Foundation", "Built on IBM's trusted, enterprise-grade open model, delivering high factual alignment and strong instruction adherence."),
    ]

    for i, (title, desc) in enumerate(novelties):
        x = Inches(0.8 + (i % 3) * 3.95) if i < 3 else Inches(0.8 + ((i - 3) * 5.95))
        y = Inches(1.6) if i < 3 else Inches(4.3)
        w = Inches(3.8) if i < 3 else Inches(5.8)
        h = Inches(2.4)

        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = c_card_bg
        card.line.color.rgb = c_blue if i == 0 else (c_purple if i == 1 else (c_green if i == 2 else c_navy))
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.name = "Arial"
        cp1.font.size = Pt(18)
        cp1.font.bold = True
        cp1.font.color.rgb = c_navy
        cp1.space_after = Pt(4)
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.name = "Arial"
        cp2.font.size = Pt(15)
        cp2.font.color.rgb = c_dark

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 10: Git Hub Link
    # ════════════════════════════════════════════════════════════════════
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "GitHub Link & Project Deliverables", "Submission Deliverables")
    add_footer(s10, 10)

    url_card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.7), Inches(1.3))
    url_card.fill.solid()
    url_card.fill.fore_color.rgb = RGBColor(237, 245, 255)
    url_card.line.color.rgb = c_blue
    url_card.line.width = Pt(2)
    utf = url_card.text_frame
    utf.word_wrap = True
    up1 = utf.paragraphs[0]
    up1.text = "Public GitHub Repository URL:"
    up1.font.name = "Arial"
    up1.font.size = Pt(18)
    up1.font.bold = True
    up1.font.color.rgb = c_navy
    up2 = utf.add_paragraph()
    up2.text = "https://github.com/amogh895/RozgarmitraAI"
    up2.font.name = "Consolas"
    up2.font.size = Pt(22)
    up2.font.bold = True
    up2.font.color.rgb = c_blue

    # Deliverables checklist
    check_box = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.1), Inches(11.7), Inches(3.6))
    check_box.fill.solid()
    check_box.fill.fore_color.rgb = c_card_bg
    check_box.line.color.rgb = c_green
    check_box.line.width = Pt(1.5)
    ctf = check_box.text_frame
    ctf.word_wrap = True
    cp = ctf.paragraphs[0]
    cp.text = "Mandatory Repository Uploads Checklist"
    cp.font.name = "Arial"
    cp.font.size = Pt(20)
    cp.font.bold = True
    cp.font.color.rgb = c_green
    cp.space_after = Pt(10)

    items = [
        "1) app.json: Complete application descriptor and metadata specification.",
        "2) RozgarMitra_ProblemStatement.pdf: Formal problem statement and requirements document.",
        "3) RozgarMitra_AI_Project_Presentation.pptx: Official submission presentation deck.",
        "4) Source Codebase: Full multi-page Streamlit application, utils, data, and configuration.",
    ]
    for item in items:
        p = ctf.add_paragraph()
        p.text = "✔  " + item
        p.font.name = "Arial"
        p.font.size = Pt(17)
        p.font.color.rgb = c_dark
        p.space_after = Pt(8)

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 11: Future Scope
    # ════════════════════════════════════════════════════════════════════
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Future Scope", "Future Roadmap")
    add_footer(s11, 11)

    scopes = [
        ("1. Multilingual Vernacular Voice Assistant", "Integrate speech-to-text and text-to-speech in Indian regional languages (Hindi, Tamil, Telugu) to empower semi-urban and rural job seekers."),
        ("2. Live Job Board & ATS API Integration", "Connect with LinkedIn, Indeed, and the National Career Service (NCS) API for real-time job scraping and one-click application alignment."),
        ("3. Multimodal Audio/Video Interview Coach", "Analyze facial expressions, vocal tone, and pacing to give holistic feedback on candidate confidence and body language."),
        ("4. Automated Upskilling Roadmaps", "Directly link detected skill gaps to curated, free certifications on IBM SkillsBuild, edX, and NPTEL."),
    ]

    for i, (title, desc) in enumerate(scopes):
        x = Inches(0.8 if i % 2 == 0 else 6.8)
        y = Inches(1.6 if i < 2 else 4.3)
        card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.7), Inches(2.5))
        card.fill.solid()
        card.fill.fore_color.rgb = c_card_bg
        card.line.color.rgb = c_purple if i == 0 else (c_green if i == 1 else (c_blue if i == 2 else c_teal))
        card.line.width = Pt(1.5)
        ctf = card.text_frame
        ctf.word_wrap = True
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.name = "Arial"
        cp1.font.size = Pt(19)
        cp1.font.bold = True
        cp1.font.color.rgb = c_navy
        cp1.space_after = Pt(6)
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.name = "Arial"
        cp2.font.size = Pt(16)
        cp2.font.color.rgb = c_dark

    # ════════════════════════════════════════════════════════════════════
    # SLIDE 12: Thank You!
    # ════════════════════════════════════════════════════════════════════
    s12 = prs.slides.add_slide(blank_layout)
    bg12 = s12.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg12.fill.solid()
    bg12.fill.fore_color.rgb = c_navy
    bg12.line.fill.background()

    ty_box = s12.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(11.333), Inches(4.5))
    ty_tf = ty_box.text_frame
    ty_tf.word_wrap = True

    p_ty = ty_tf.paragraphs[0]
    p_ty.alignment = PP_ALIGN.CENTER
    p_ty.text = "Thank You!"
    p_ty.font.name = "Arial"
    p_ty.font.size = Pt(64)
    p_ty.font.bold = True
    p_ty.font.color.rgb = c_white
    p_ty.space_after = Pt(14)

    p_sub = ty_tf.add_paragraph()
    p_sub.alignment = PP_ALIGN.CENTER
    p_sub.text = "Thank you for your time and interest."
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(24)
    p_sub.font.color.rgb = RGBColor(144, 202, 249)
    p_sub.space_after = Pt(28)

    p_proj = ty_tf.add_paragraph()
    p_proj.alignment = PP_ALIGN.CENTER
    p_proj.text = "RozgarMitra AI – Your AI-Powered Job & Career Mentor"
    p_proj.font.name = "Arial"
    p_proj.font.size = Pt(20)
    p_proj.font.bold = True
    p_proj.font.color.rgb = c_white

    p_author = ty_tf.add_paragraph()
    p_author.alignment = PP_ALIGN.CENTER
    p_author.text = "Developed by Amogh Dixit | Powered by IBM Granite on IBM watsonx.ai & LangFlow"
    p_author.font.name = "Arial"
    p_author.font.size = Pt(16)
    p_author.font.color.rgb = RGBColor(200, 225, 255)

    # Save
    out_file = "RozgarMitra_AI_Project_Presentation.pptx"
    prs.save(out_file)
    print(f"\n[+] Successfully generated presentation: {out_file}\n")


if __name__ == "__main__":
    build_deck()
