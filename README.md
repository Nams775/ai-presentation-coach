**# 🎤 AI Presentation Coach

AI Presentation Coach is a web-based application that helps users improve their **presentation, interview, and communication skills** using AI-powered question generation and feedback.  
Users can practice through **text input, file uploads, or voice input**, receive grammar and content feedback, and simulate interview-style interactions.

---

## 🚀 Features

- 🧠 AI-generated practice questions  
- ✍️ Text-based answer evaluation  
- 📎 File upload support (PDF / DOC / TXT)  
- 🎙️ Voice input UI (analysis planned)  
- 📝 Grammar correction and suggestions  
- 🔄 Dynamic follow-up questions  
- 🌐 Deployed frontend and backend  

---

## 🛠️ Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
- Firebase Hosting  

### Backend
- Python  
- Flask  
- Flask-CORS  
- REST APIs  
- Render (Deployment)  

---

## 🔗 API Endpoints

### 1️⃣ Generate Questions

**Endpoint**

**Request**
``json
{
  "topic": "Computer Networks"
}
Response

{
  "questions": [
    "What is Computer Networks?",
    "Explain the core concepts of Computer Networks."
  ]
}
2️⃣ Generate Feedback

Endpoint

POST /generate-feedback


Request

{
  "question": "What is Computer Networks?",
  "answer": "Computer networks allow devices to communicate."
}


Response

{
  "grammar_issues": "No major grammatical mistakes found.",
  "feedback": "Good explanation, but try adding a real-world example.",
  "next_question": "Can you give a real-world example of computer networks?"
}
⚙️ Local Setup
Backend Setup
git clone https://github.com/your-username/ai-presentation-coach-backend.git
cd backend
pip install -r requirements.txt
python app.py


Backend runs on

http://localhost:5000

Frontend Setup
cd frontend
firebase init hosting
firebase deploy

🌍 Live Demo

Frontend
👉 https://ai-presentation-coach-3822c.web.app

Backend
👉 https://ai-presentation-coach-backend.onrender.com

📌 Future Improvements

Speech-to-text analysis for voice responses

AI scoring and confidence analysis

Real interview mode (HR / Technical)

Resume parsing and semantic evaluation

User progress analytics

👩‍💻 Author

Namratha Srinivas

GitHub: https://github.com/Nams775

⭐ Acknowledgements

Flask & Python 

Community

Firebase Hosting

Render Platform

AI-assisted development tools

OUTPUT
https://github.com/user-attachments/assets/3d323e06-6ccc-4585-ac89-7a0d3c86e80e

Deployement:https://ai-presentation-coach-3822c.web.app
### 🚀 Deployment Status
- Frontend: Firebase Hosting ✅
- Backend: Render ✅


**




