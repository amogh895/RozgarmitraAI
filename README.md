# 🎯 RozgarMitra AI – Your AI-Powered Job & Career Mentor

A Streamlit web application that delivers personalised career mentoring, resume feedback, interview preparation, and job-fit analysis — powered by **IBM Granite** on **IBM watsonx.ai**.

---

## Deployment Details 

Platform: Streamlit Community Cloud (Free Tier)
Deployment URL: https://rozgarmitra-ai.streamlit.app
                 Or
Click here : [ProjectDemo](https://rozgarmitra-ai.streamlit.app)


## Features

| Page | Description |
|------|-------------|
| 👤 **My Profile** | Save your skills, experience, and career goals — used by every other feature |
| 📄 **Resume Review** | Paste your resume and get an AI score, strengths, and actionable improvements |
| 🎤 **Interview Prep** | Generate role-specific interview questions with expert tips |


---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Model | IBM Granite (`ibm/granite-3-8b-instruct`) via IBM watsonx.ai |
| AI SDK | `ibm-watsonx-ai` Python SDK |
| Frontend | Python + Streamlit |
| Data Storage | JSON files (no database required) |
| Cloud | IBM Cloud |

---

## Prerequisites

- Python 3.11+
- An [IBM Cloud](https://cloud.ibm.com) account with watsonx.ai access
- A watsonx.ai project with the IBM Granite model enabled

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/amogh895/RozgarmitraAI.git
cd RozgarmitraAI
```

### 2. Create a virtual environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure credentials

```bash
cp .env.example .env
```

Edit `.env` and fill in your IBM watsonx.ai credentials:

```env
WATSONX_API_KEY=your_ibm_cloud_api_key_here
WATSONX_PROJECT_ID=your_watsonx_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

- **API Key**: [IBM Cloud → Manage → Access (IAM) → API keys](https://cloud.ibm.com/iam/apikeys)
- **Project ID**: watsonx.ai → Projects → your project → Manage → General

### 5. Run the app

```bash
streamlit run app.py
```

The app opens at `http://localhost:8501`.

---

## Project Structure

```
rozgarMitra-ai/
├── app.py                   # Entry point — landing page
├── pages/
│   ├── 1_👤_My_Profile.py
│   ├── 2_📄_Resume_Review.py
│   ├── 3_🎤_Interview_Prep.py

├── utils/
│   ├── watsonx_client.py    # IBM Granite inference wrapper
│   ├── prompts.py           # Prompt templates for each feature
│   └── data_store.py        # JSON-based profile & history persistence
├── data/
│   └── sample_jobs.json     # Sample job listings for Job Match
├── .streamlit/
│   └── config.toml          # Streamlit theme configuration
├── .env.example             # Credential template
└── requirements.txt
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `WATSONX_API_KEY` | IBM Cloud API key with watsonx.ai access |
| `WATSONX_PROJECT_ID` | Your watsonx.ai project ID |
| `WATSONX_URL` | watsonx.ai endpoint (default: `https://us-south.ml.cloud.ibm.com`) |

---

## IBM Granite Model

This app uses `ibm/granite-3-8b-instruct`, IBM's open-source instruction-following model available on the IBM Lite plan with **300,000 free inference tokens per month**.




