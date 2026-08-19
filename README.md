# Intervue AI 🤖

### Adaptive Technical Interviews Powered by Generative AI

**Intervue AI** is an AI-powered technical interview platform that conducts **personalized, curriculum-aware, and adaptive interviews**.

Instead of asking every candidate the same predefined questions, Intervue AI analyzes the candidate's background, evaluates each response, identifies strengths and weaknesses, and dynamically generates the next question based on the candidate's demonstrated knowledge.

---

## 🚀 Live Demo

### [Try Intervue AI →](https://intervue-ai-tau.vercel.app/)

**Status:** 🟢 Deployed & Functional

Experience the adaptive technical interview system directly through the live application.

---

## 🎯 Why Intervue AI?

Traditional interview platforms often depend on static question banks:

```text
Question 1
    ↓
Question 2
    ↓
Question 3
    ↓
Question 4
```

Intervue AI follows an adaptive approach:

```text
Candidate Profile
       ↓
Interview Strategy
       ↓
Question Generation
       ↓
Candidate Answer
       ↓
AI Evaluation
       ↓
Identify Strengths & Weaknesses
       ↓
Adaptive Next Question
       ↓
Final Assessment
```

This allows the interview to evolve according to the candidate's actual performance.

---

# ✨ Key Features

## 🧠 AI-Powered Adaptive Interviewing

Questions are generated dynamically based on:

* Candidate profile
* Selected technical domain
* Current topic
* Previous questions
* Previous answers
* AI evaluation
* Candidate strengths and weaknesses
* Curriculum objectives

The system can increase difficulty, probe deeper, revisit weak concepts, or move to a different topic.

---

## 👤 Candidate Analysis

Intervue AI analyzes the candidate's technical background to determine relevant areas for the interview.

The interview strategy prioritizes topics that provide meaningful assessment of the candidate's knowledge.

---

## 📚 Curriculum-Grounded Interviews

The AI does not generate questions in isolation.

Relevant curriculum context can include:

* Topic
* Subtopic
* Learning objectives
* Tools and technologies
* Technical concepts
* Expected knowledge level

This helps keep generated questions aligned with the intended learning or assessment objectives.

---

## 📊 Intelligent Answer Evaluation

Every candidate response is evaluated across multiple dimensions.

| Evaluation Dimension    | Score |
| ----------------------- | ----: |
| Technical Accuracy      |  1–10 |
| Conceptual Depth        |  1–10 |
| Problem Solving         |  1–10 |
| Communication / Clarity |  1–10 |

The system also identifies:

* Strengths
* Weaknesses
* Overall performance
* Areas requiring further probing

---

## 🔄 Adaptive Follow-Up Questions

The evaluation of one answer becomes context for the next question.

```text
Previous Question
        +
Candidate Answer
        +
AI Evaluation
        +
Curriculum Context
        ↓
Adaptive Question Generation
        ↓
Next Question
```

For example:

**Strong Answer →** increase difficulty or explore advanced concepts.

**Partial Answer →** ask a targeted follow-up.

**Weak Answer →** revisit the underlying concept.

---

## 🔟 Structured Interview

Each interview is designed around a maximum of **10 questions**.

The system maintains topic coverage while allowing the interview to adapt according to candidate performance.

---

## 📋 Final Assessment

After the interview, Intervue AI provides a consolidated assessment of the candidate.

The assessment can be used to understand:

* Overall technical performance
* Strong technical areas
* Weak areas
* Knowledge gaps
* Areas for improvement

---

# 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │    Candidate     │
                         └────────┬─────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Candidate Analyzer  │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Interview Strategy  │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Curriculum Context  │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │   Prompt Builder    │
                       └──────────┬──────────┘
                                  │
                                  ▼
                         ┌────────────────┐
                         │  Gemini LLM    │
                         └───────┬────────┘
                                 │
                                 ▼
                       ┌─────────────────────┐
                       │ Interview Question  │
                       └──────────┬──────────┘
                                  │
                                  ▼
                         Candidate Answer
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │  Answer Evaluator   │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Adaptive Next Step  │
                       └──────────┬──────────┘
                                  │
                                  └──────────────► Next Question
```

---

# 🛠️ Technology Stack

## Frontend

* **React.js**
* **Vite**
* JavaScript / JSX
* Responsive UI

## Backend

* **Python**
* **FastAPI**
* **Pydantic**
* REST APIs

## AI / Generative AI

* **Google Gemini**
* `google-genai`
* Prompt Engineering
* Structured AI Responses
* Context-aware generation
* Adaptive evaluation

## Development & Deployment

* Git
* GitHub
* Vercel
* Python Virtual Environment
* Environment Variables

---

# 📂 Project Structure

```text
Intervue-AI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── prompts/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

> The exact directory structure may vary depending on the current repository version.

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have:

* Python 3.10+
* Node.js 18+
* npm
* Git
* Google Gemini API key

---

## 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Intervue-AI
```

---

## 2. Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

**Never commit your API key to GitHub.**

---

## 4. Run the Backend

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

## 5. Run the Frontend

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite.

---

# 🧪 Interview Evaluation Pipeline

The evaluation system follows a structured pipeline:

```text
Candidate Answer
       ↓
Answer Analysis
       ↓
Technical Accuracy
       ↓
Conceptual Depth
       ↓
Problem Solving
       ↓
Communication
       ↓
Strengths & Weaknesses
       ↓
Overall Evaluation
       ↓
Interview Context Update
       ↓
Next Question
```

This feedback loop allows the interview to continuously adapt to the candidate.

---

# 🎯 Example Interview Flow

Suppose the candidate selects:

```text
Domain: Computer Science
Topic: Data Structures
```

The system may begin with a fundamental question.

### If the candidate performs strongly:

```text
Basic Concept
     ↓
Strong Answer
     ↓
Higher Difficulty
     ↓
Advanced Concept
```

### If the candidate struggles:

```text
Conceptual Question
     ↓
Weak Answer
     ↓
Identify Knowledge Gap
     ↓
Targeted Follow-up
```

This makes the interview more similar to a real technical discussion rather than a static quiz.

---

# 💡 Core Innovation

The primary focus of Intervue AI is **adaptive technical assessment**.

Instead of treating the interview as a fixed sequence of questions, the platform treats it as a continuous feedback system:

```text
Performance → Evaluation → Reasoning → Adaptation
```

The candidate's previous performance directly influences what the system asks next.

---

# 🔮 Future Scope

Intervue AI can be extended with:

* 🎙️ Voice-based interviews
* 🗣️ Speech-to-text answer processing
* 📹 Video interview support
* 🧑‍💼 Recruiter dashboard
* 📈 Candidate performance analytics
* 📄 Automated interview reports
* 🏆 Candidate ranking
* 💼 Resume-based interview generation
* 🌐 Multi-language interviews
* 💻 Live coding interviews
* 🔗 Coding platform integration
* 🗃️ Persistent candidate history
* 📊 Long-term candidate performance tracking

---

# 📸 Demo

**Live Application:**
https://intervue-ai-tau.vercel.app/

For the GitHub repository, screenshots and a short demonstration GIF/video can be added here to showcase:

1. Candidate setup
2. Interview generation
3. Answer submission
4. AI evaluation
5. Adaptive follow-up
6. Final assessment

---

# 👥 Project Information

**Project:** Intervue AI
**Domain:** Generative AI • EdTech • Technical Assessment
**Type:** AI-Powered Web Application
**Status:** 🟢 Deployed & Functional

---

# 📌 Project Highlights

* ✅ Generative AI-powered interviews
* ✅ Adaptive question generation
* ✅ Curriculum-aware question generation
* ✅ Multi-dimensional answer evaluation
* ✅ Strength and weakness identification
* ✅ Dynamic follow-up questions
* ✅ Structured 10-question interviews
* ✅ Final candidate assessment
* ✅ Live deployed application

---

## 📄 License

This project is developed for educational, research, and portfolio purposes.
