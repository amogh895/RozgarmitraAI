# Problem Statement : RozgarMitra AI
## AI-Powered Career & Job Mentor

### 1. The Challenge
Navigating today's dynamic employment landscape is a major hurdle for early-career professionals, recent graduates, and vocational job seekers. Key industry challenges include:
- **Prohibitive Career Counseling Costs:** Access to personalized human mentorship, career coaching, and mock interviews carries high fees, excluding millions of aspirants.
- **Opaque ATS Screening:** Traditional Applicant Tracking Systems filter out candidates based on keyword matching without clarifying why the resume fell short or providing concrete remediation.
- **Lack of Structured Interview Preparation:** Candidates often struggle to formulate behavioral answers using structured frameworks (such as the STAR methodology) and lack role-specific technical question drills.
- **Generic & Unconstrained AI Chatbots:** Standard conversational LLMs frequently hallucinate, lack domain guardrails, lose context across interview sessions, and drift into irrelevant non-career topics.

---

### 2. The Objective
The objective of this project is to build **RozgarMitra AI**, an autonomous, multi-agent career mentoring system powered by **IBM watsonx.ai**, **IBM Granite (ibm/granite-3-8b-instruct)**, and **LangFlow**.

The solution delivers:
1. **Dynamic Candidate Profiling:** Captures, serializes, and manages candidate competencies, experience, and career goals in a zero-database JSON store.
2. **Contextual Resume Audit & ATS Enhancement:** Calibrates resume quality on a 1–10 scale, extracts 3 concrete strengths, pinpoints 3 actionable improvements, and rewrites a targeted professional summary.
3. **Role-Specific STAR Interview Synthesis:** Generates 5 tailored behavioral and technical interview questions paired with expert scoring rubrics.
4. **Semantic Job-Fit & Skill Gap Analysis:** Computes alignment percentages between candidate profiles and job descriptions, identifying key skill gaps and strategic application talking points.
5. **Domain-Guardrailed Career Mentorship:** Provides continuous conversational guidance with strict domain boundaries that politely reject non-career queries.

---

### 3. Multi-Agent System Architecture
- **Candidate Profile & Context Agent:** Manages stateful user profile serialization.
- **Resume Evaluator Agent:** Evaluates resume text against job specifications.
- **Interview Coach Agent:** Simulates structured interviews with STAR response tips.
- **Job-Fit & Gap Analysis Agent:** Assesses compatibility and isolates skill deficits.
- **Conversational Career Mentor Agent:** Provides 24/7 guardrailed career advice.

---

### 4. Technology Stack
- **Foundation Model:** IBM Granite-3-8B-Instruct (`ibm/granite-3-8b-instruct`)
- **Platform & Governance:** IBM watsonx.ai & IBM Cloud
- **Workflow Orchestration:** LangFlow
- **Frontend & Interface:** Streamlit (Python)
- **Data Persistence:** JSON-based state persistence

---

### 5. Expected Impact
RozgarMitra AI democratizes high-quality, personalized career mentoring, providing job seekers with actionable feedback, targeted interview readiness, and transparent job-fit analysis at zero financial barrier.
