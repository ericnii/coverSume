# CoverSume

CoverSume is a full-stack web application that uses AI to generate professional resumes and cover letters. The application leverages OpenAI's GPT-4o model to create personalized, well-formatted documents based on user input and job postings.

## Features

- **AI-Powered Resume Generation**: Automatically generates professional resumes in LaTeX format based on user-provided information including education, experience, projects, and skills
- **AI-Powered Cover Letter Generation**: Creates tailored cover letters that match job postings by analyzing the full job description and aligning it with the user's resume
- **Dynamic Form Fields**: Add or remove multiple entries for education, experience, and projects
- **PDF Export**: Generates high-quality PDF documents ready for download
- **Modern UI**: Built with React and Tailwind CSS for a clean, responsive user experience

## Tech Stack

### Frontend
- React 19.1.0
- React Router DOM 7.6.3
- Tailwind CSS 3.4.17
- React Spring Parallax 10.0.1
- Lottie React 2.4.1

### Backend
- Node.js
- Express 5.1.0
- OpenAI API (GPT-4o)
- Multer 2.0.2 (for file uploads)
- node-latex 3.1.0 (for PDF generation)
- LaTeX (for document compilation)

## Project Structure

```
cover-sume/
├── src/                    # Frontend React application
│   ├── App.js              # Main app component with routing
│   ├── resume.js           # Resume generator component
│   ├── cover.js            # Cover letter generator component
│   ├── about.js            # About page component
│   └── index.js            # Entry point
├── backend/                # Backend Express server
│   ├── server.js           # Express server and API routes
│   ├── ai_resume.js        # Resume generation logic with OpenAI
│   ├── ai_cover.js         # Cover letter generation logic with OpenAI
│   ├── latex.js            # LaTeX compilation utilities
│   └── uploads/            # Temporary file uploads directory
├── public/                 # Static assets
│   ├── ref.tex            # Resume LaTeX template reference
│   ├── ref_cov.tex        # Cover letter LaTeX template reference
│   └── resume.png         # Reference resume image
├── Dockerfile             # Docker configuration for deployment
└── package.json           # Frontend dependencies

```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- LaTeX distribution (for PDF generation)
  - On macOS: `brew install --cask mactex` or `brew install basictex`
  - On Ubuntu/Debian: `sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-latex-extra`
  - On Windows: Install MiKTeX or TeX Live
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cover-sume
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory
   - Add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Configuration

### Frontend Configuration

The frontend is configured to connect to the backend. To switch between local and production:

- **Local development**: Update URLs in `src/resume.js` and `src/cover.js` to use `http://localhost:3001`
- **Production**: Use `https://coversume-backend.onrender.com`

### Backend Configuration

The backend CORS is configured in `backend/server.js` to allow requests from:
- `http://localhost:3000` (local development)
- `https://coversume-frontend.onrender.com` (production)

## Running Locally

### Start the Backend Server

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3001` (or the port specified in the `PORT` environment variable).

### Start the Frontend Development Server

1. In a new terminal, navigate to the project root:
```bash
cd cover-sume
```

2. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000` and will automatically open in your browser.

## API Endpoints

### POST /generate-resume
Generates a resume PDF based on user input.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "city": "Toronto, ON",
  "phone": "123-456-7890",
  "linkedin": "https://linkedin.com/in/johndoe",
  "github": "https://github.com/johndoe",
  "skills": "Languages: JavaScript, Python",
  "education": [
    {
      "education": "University of Toronto",
      "degree": "Bachelor of Science, May 2028",
      "points": "Dean's List Scholar 2024"
    }
  ],
  "experiences": [
    {
      "jobTitle": "Software Engineering Intern",
      "company": "Tech Company, Toronto, ON",
      "duration": "June 2023 - August 2023",
      "jobSkills": "ReactJS, Node.js",
      "jobDescription": "Developed and tested new features..."
    }
  ],
  "project": [
    {
      "projectName": "E-commerce Web Application",
      "projectSkills": "ReactJS, Node.js",
      "projectDescription": "Built a full-stack e-commerce application..."
    }
  ]
}
```

**Response:**
```json
{
  "url": "/resume-pdf"
}
```

### POST /cover-letter
Generates a cover letter PDF based on user input and job posting.

**Request Body:** (multipart/form-data)
- `name`: Full name
- `location`: City or address
- `phone`: Phone number
- `email`: Email address
- `linkedin`: LinkedIn URL (optional)
- `github`: GitHub URL (optional)
- `companyName`: Company name
- `companyAddress`: Company address
- `jobPosting`: Full job posting/description text
- `hiringManager`: Hiring manager name (optional)
- `resume`: Resume image file (PNG format, required)

**Response:**
```json
{
  "url": "/cover-pdf"
}
```

### GET /resume-pdf
Serves the generated resume PDF.

### GET /cover-pdf
Serves the generated cover letter PDF.

## Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Connect your repository to Render
3. Configure the service:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Environment Variables**: Add `OPENAI_API_KEY`
4. Deploy

### Frontend Deployment

The frontend can be deployed to:
- **Vercel**: Connect your GitHub repository and deploy
- **Netlify**: Connect your GitHub repository and deploy
- **Render**: Build the React app and serve static files

**Build for production:**
```bash
npm run build
```

The `build` folder contains the production-ready static files.

### Docker Deployment

A Dockerfile is included for containerized deployment:

```bash
docker build -t coversume .
docker run -p 3001:3001 -e OPENAI_API_KEY=your_key coversume
```

## Usage

### Generating a Resume

1. Navigate to the Resume Generator page
2. Fill in your personal information
3. Add education entries (click "+ Add Education" for multiple entries)
4. Add your skills
5. Add work experience entries (click "+ Add Experience" for multiple entries)
6. Add project entries (click "+ Add Project" for multiple entries)
7. Click "Generate Resume"
8. Once generated, click "Open PDF in New Tab" to view and download

### Generating a Cover Letter

1. Navigate to the Cover Letter Generator page
2. Fill in your personal information
3. Enter company details
4. **Paste the full job posting** in the "Job Posting" textarea (this helps the AI tailor the cover letter)
5. Upload a screenshot/image of your resume (PNG format)
6. Click "Generate Cover Letter"
7. Once generated, click "Open PDF in New Tab" to view and download

## How It Works

### Resume Generation

1. User submits form data with personal information, education, experience, projects, and skills
2. Backend formats the data into LaTeX structure
3. OpenAI GPT-4o generates LaTeX code based on a reference template and user data
4. LaTeX code is compiled to PDF using node-latex
5. PDF is served to the user

### Cover Letter Generation

1. User submits form data including the full job posting text and resume image
2. Backend processes the resume image and extracts user information
3. OpenAI GPT-4o analyzes the job posting and resume to create a tailored cover letter
4. The AI generates LaTeX code for the cover letter
5. LaTeX code is compiled to PDF
6. PDF is served to the user

## Troubleshooting

### Backend Issues

**Error: "Failed to generate resume/cover letter"**
- Check that your OpenAI API key is set correctly in the `.env` file
- Verify that LaTeX is installed and accessible
- Check backend logs for specific error messages

**CORS Errors**
- Ensure the frontend URL is added to the CORS origins in `backend/server.js`
- For local development, make sure `http://localhost:3000` is in the CORS list

**LaTeX Compilation Errors**
- Ensure all required LaTeX packages are installed
- Check that the generated LaTeX code is valid
- Review backend logs for LaTeX compilation errors

### Frontend Issues

**"Error, please press Generate Resume again"**
- Check browser console (F12) for detailed error messages
- Verify the backend server is running
- Check network tab to see if the request is reaching the backend

**PDF Not Displaying**
- Ensure the backend PDF generation completed successfully
- Check that the PDF URL is correct
- Try opening the PDF URL directly in a new tab

## Environment Variables

### Backend (.env file)
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Server port (optional, defaults to 3001)

## License

ISC

## Contributing

This is a personal project. For issues or suggestions, please open an issue on the repository.

## Acknowledgments

- OpenAI for the GPT-4o API
- React team for the excellent framework
- Tailwind CSS for the utility-first CSS framework
