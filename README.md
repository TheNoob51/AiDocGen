# AI-Assisted Document Authoring Platform

A full-stack web application that allows users to generate, refine, and export structured business documents (Word & PowerPoint) using AI.

## Features

- **Authentication**: Secure login and registration using Firebase Auth.
- **Project Management**: Dashboard to manage multiple document projects.
- **Document Configuration**:
  - **Word**: Define outlines with sections.
  - **PowerPoint**: Define slides and titles.
- **AI Generation**: Uses Google Gemini API to generate content for each section/slide.
- **Interactive Refinement**: Refine specific sections with AI prompts (e.g., "Make it shorter").
- **Export**: Download final documents as .docx or .pptx.

## Tech Stack

- **Frontend**: React, Vite, Vanilla CSS (Dark Mode)
- **Backend**: FastAPI, Python
- **Database**: Firebase Firestore
- **AI**: Google Gemini API
- **Document Processing**: python-docx, python-pptx

## Setup Instructions

### Prerequisites

- Node.js & npm
- Python 3.8+
- Firebase Project (with Auth and Firestore enabled)
- Google Gemini API Key

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   - Create a `.env` file in the `backend` directory.
   - Add your Firebase Service Account JSON path and Gemini API Key:
     ```
     FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json
     GEMINI_API_KEY=your_gemini_api_key
     ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Create a `.env` file in the `frontend` directory.
   - Add your Firebase config:
     ```
     VITE_FIREBASE_API_KEY=...
     VITE_FIREBASE_AUTH_DOMAIN=...
     VITE_FIREBASE_PROJECT_ID=...
     ...
     ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Register for an account.
2. Click "New Project" on the dashboard.
3. Select Document Type (Word or PPTX) and enter a topic.
4. Configure the outline or slides.
5. Click "Save & Generate".
6. Wait for AI to generate content.
7. Use the "Refine" input to tweak specific sections.
8. Click "Export Document" to download.
