<div align="center">

# 🎯 Interview AI

**Your personal AI interview coach — turn any resume and job description into a full mock-interview prep kit.**

[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Frontend-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-ISC-lightgrey)](#license)

</div>

---

## 📖 About

**Interview AI** is a full-stack MERN application that helps candidates prepare for job interviews using AI. A user uploads their **resume (PDF)**, pastes the **job description**, and adds a short **self-description** — the app then generates a complete, personalized interview prep report: a resume-to-JD match score, likely technical and behavioral questions (with the interviewer's intent and a model answer for each), identified skill gaps, and a day-by-day preparation plan. Every report is saved to the user's account so it can be revisited later, and can also be exported back out as a PDF.

---

## ✨ Features

- 🔐 **Secure authentication** — JWT + HTTP-only cookies with a server-side token blacklist for clean, safe logout
- 📄 **Resume-aware analysis** — upload a PDF resume, parsed and understood alongside the job description
- 🤖 **AI-generated interview report** — powered by Google Gemini, covering:
  - ✅ Resume ↔ Job Description **match score**
  - 💻 **Technical questions** — each with the interviewer's intention and a suggested answer
  - 🗣️ **Behavioral questions** — same structured breakdown
  - 📊 **Skill gap analysis** — rated by severity (low / medium / high)
  - 🗓️ **Day-by-day preparation plan** — focused tasks to close the gaps before the interview
- 🧾 **PDF export** — generate a polished PDF of your report using Puppeteer
- 📚 **Report history** — every past interview report is stored and retrievable from your account
- ⚡ **Modern frontend** — fast, feature-organized React + Vite app with protected routing

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router, Axios, Sass |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB with Mongoose |
| **AI** | Google Gemini (`@google/genai`) |
| **Auth & Security** | JWT, bcrypt.js, HTTP-only cookies |
| **File Handling** | Multer (uploads), pdf-parse (resume parsing), Puppeteer (PDF generation) |
| **Validation** | Zod |

---

## 📁 Project Structure

```
Interview-AI/
├── Backend/
│   ├── server.js               # Entry point
│   └── src/
│       ├── app.js              # Express app & middleware setup
│       ├── config/              # Database connection
│       ├── models/               # User, InterviewReport, Blacklist schemas
│       ├── routes/                # /api/auth, /api/interview
│       ├── controllers/            # Route handlers
│       ├── services/                # AI (Gemini) integration
│       └── middlewares/              # Auth guard, file upload
└── Frontend/
    └── src/
        ├── app.routes.jsx        # App routing
        └── features/
            ├── auth/               # Login, Register, protected routes
            └── interview/           # Home, Interview report pages
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the repo

```bash
git clone https://github.com/SayyadMehraj/Interview-AI.git
cd Interview-AI
```

### 2. Set up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```env
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret
GEMINI_API_KEY = your_gemini_api_key
```

Run the backend (default port `3000`):

```bash
npm run dev
```

### 3. Set up the Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default and is pre-configured to talk to the backend at `http://localhost:3000`.

---

## 🔗 API Overview

### Authentication

| Method | Endpoint | Description | 
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in with email & password | 
| `GET` | `/api/auth/logout` | Log out & blacklist token |
| `GET` | `/api/auth/get-me` | Get current logged-in user | 

### Interview - Related

| Method | Endpoint | Description | 
|---|---|---|
| `POST` | `/api/interview/` | Generate a new interview report (resume + JD + self-description) | 
| `GET` | `/api/interview/` | Get all interview reports for the logged-in user | 
| `GET` | `/api/interview/report/:interviewId` | Get a specific interview report | 
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate a downloadable PDF of a report | 

---

<div align="center">

<b>Built as a hands-on project to explore full-stack development with AI integration.</b><br>
<i>⭐ If you find this useful, consider giving the repo a star!</i>

</div>
