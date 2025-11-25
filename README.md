# AI-Assisted Document Authoring Platform

A full-stack web application designed to help users generate, refine, and export structured business documents (Word & PowerPoint) using the power of Google Gemini AI.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Local Setup](#-installation--local-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#-configuration)
- [Deployment Guide](#-deployment-guide)
  - [Deploying Backend (Render)](#deploying-backend-render)
  - [Deploying Frontend (Vercel)](#deploying-frontend-vercel)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

*   **Secure Authentication**: User sign-up and login powered by Firebase Auth.
*   **Project Dashboard**: Manage multiple document generation projects in one place.
*   **Smart Document Configuration**:
    *   **Word Documents**: Define custom outlines with sections and subsections.
    *   **PowerPoint Presentations**: Organize slides with titles and bullet points.
*   **AI Content Generation**: Utilizes Google's Gemini API to automatically generate high-quality content for each section or slide.
*   **Interactive Refinement**: "Chat" with your document to refine specific sections (e.g., "Make this paragraph more professional", "Shorten this slide").
*   **Export Capability**: Download your finished work as formatted `.docx` or `.pptx` files.

---

## 🛠 Tech Stack

### Frontend
*   **Framework**: [React](https://reactjs.org/) (v19)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: Vanilla CSS (with modern features like Variables & Flexbox/Grid)
*   **Routing**: React Router v6
*   **HTTP Client**: Axios

### Backend
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   **Server**: Uvicorn
*   **AI Integration**: Google Generative AI SDK (Gemini)
*   **Document Processing**: `python-docx` (Word), `python-pptx` (PowerPoint)

### Infrastructure
*   **Database**: Firebase Firestore (NoSQL)
*   **Authentication**: Firebase Authentication
*   **Environment Management**: `python-dotenv`

---

## 📂 Project Structure

```
experiment_antigravity/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── routers/         # API Endpoints (projects, generate, export)
│   │   ├── services/        # Business logic (Firebase, AI, Doc generation)
│   │   └── models/          # Pydantic models
│   ├── main.py              # Application entry point
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Backend environment variables template
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages (Dashboard, Editor, etc.)
│   │   ├── services/        # API calls to backend
│   │   └── App.jsx          # Main component
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
│
└── README.md                # Project documentation
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js** (v16 or higher) & **npm**
*   **Python** (v3.8 or higher)
*   **Git**

You also need accounts for:
*   **Firebase**: Create a project and enable **Authentication** (Email/Password) and **Firestore Database**.
*   **Google AI Studio**: Get a Gemini API Key.

---

## 🚀 Installation & Local Setup

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # Mac/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    *   Create a `.env` file in the `backend` folder.
    *   Download your **Firebase Service Account Key** (Project Settings > Service accounts > Generate new private key) and save it as `serviceAccountKey.json` in the `backend` folder.
    *   Add the following to `.env`:
        ```env
        FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json
        GEMINI_API_KEY=your_actual_gemini_api_key_here
        ```

5.  **Run the server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend will start at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    *   Create a `.env` file in the `frontend` folder.
    *   Get your Firebase Web Config (Project Settings > General > Your apps).
    *   Add the following (prefix with `VITE_`):
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        # URL of your local backend
        VITE_API_BASE_URL=http://localhost:8000
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will start at `http://localhost:5173`.

---

## ☁️ Deployment Guide

### Deploying Backend (Render)

We recommend **Render** because it supports "Secret Files" easily, which is needed for the Firebase JSON key.

1.  **Push your code to GitHub.**
2.  **Create a new Web Service on Render.**
3.  **Connect your repository.**
4.  **Settings:**
    *   **Root Directory**: `backend`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5.  **Environment Variables:**
    *   Add `GEMINI_API_KEY` with your key.
    *   Add `PYTHON_VERSION` (e.g., `3.9.0`).
6.  **Secret Files:**
    *   Go to the "Secret Files" tab in your Render service dashboard.
    *   Filename: `serviceAccountKey.json`
    *   Content: Paste the *entire content* of your local `serviceAccountKey.json` file here.
    *   Add an Environment Variable `FIREBASE_CREDENTIALS_PATH` with value `/etc/secrets/serviceAccountKey.json` (Render mounts secret files at `/etc/secrets/`).

### Deploying Frontend (Vercel)

1.  **Push your code to GitHub.**
2.  **Go to Vercel and "Add New Project".**
3.  **Import your repository.**
4.  **Project Settings:**
    *   **Framework Preset**: Vite
    *   **Root Directory**: `frontend` (Edit this!)
5.  **Environment Variables:**
    *   Copy all variables from your frontend `.env` file.
    *   **Crucial**: Change `VITE_API_BASE_URL` to the **URL of your deployed Render backend** (e.g., `https://your-app.onrender.com`).
6.  **Deploy.**

---

## ❓ Troubleshooting

*   **CORS Errors**: If the frontend cannot talk to the backend, ensure the `origins` list in `backend/main.py` includes your frontend's URL (localhost or deployed URL).
*   **Firebase Errors**: Ensure your Firestore database rules allow read/write access (for testing, start with test mode, but secure it for production).
*   **"Failed to create document"**: Check the backend logs. It usually means the `serviceAccountKey.json` is missing or invalid, or the Gemini API key is incorrect.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
