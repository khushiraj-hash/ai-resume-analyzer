# AI Resume Analyzer 🚀

An AI-powered resume analysis and interview preparation platform that helps job seekers understand how well their resumes align with a target job description and prepare more effectively for interviews.

Upload your resume, provide a job description, and add a brief self-description to generate an AI-assisted analysis and personalized interview preparation report.

## ✨ Features

- **Resume Upload:** Upload your resume in PDF format for analysis.
- **Job Description Analysis:** Evaluate your resume against a target job description.
- **AI-Powered Insights:** Generate personalized insights using Google's Gemini API.
- **Interview Preparation:** Generate an interview preparation plan based on your resume and target role.
- **User Authentication:** Secure registration and login functionality.
- **Report Management:** Store and manage generated interview reports.
- **Responsive Interface:** Clean and user-friendly frontend experience.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI Integration | Google Gemini API |
| Authentication | JWT |
| File Processing | PDF parsing |
| Development Tools | Git, GitHub, VS Code |

## 📁 Project Structure

```text
ai-resume-analyzer/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/khushiraj-hash/ai-resume-analyzer.git

cd ai-resume-analyzer
```

### 2. Set Up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open another terminal:

```bash
cd Frontend
npm install
```

Configure the frontend API URL in your environment file if required by the application.

Example:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the Application

Visit:

```text
http://localhost:5173
```

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `GEMINI_API_KEY` | Google Gemini API key |
| `VITE_API_URL` | Backend API base URL |

**Note:** Never commit your `.env` files or expose API keys and database credentials publicly.

## 🔄 Application Workflow

1. Register or log in to your account.
2. Upload your resume in PDF format.
3. Enter the job description for your target role.
4. Provide a short self-description.
5. Submit the information for AI-powered analysis.
6. Review the generated analysis and interview preparation report.

## 🎯 Project Objective

The goal of AI Resume Analyzer is to simplify resume evaluation and make interview preparation more personalized by combining document processing, full-stack web development, database management, and generative AI.

## 🚀 Future Enhancements

- Resume scoring and improvement recommendations.
- ATS compatibility analysis.
- Skill gap identification.
- Personalized mock interview questions.
- Interview performance tracking.
- Downloadable PDF analysis reports.

## 👩‍💻 Author

**Khushi Raj**

- GitHub: [@khushiraj-hash](https://github.com/khushiraj-hash)
- LinkedIn: [Khushi Raj](https://linkedin.com/in/khushi-raj-417359328/)

---

⭐ If you find this project interesting, consider giving the repository a star!
