const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const fs = require('fs');
const multer = require('multer'); 
const dotenv = require('dotenv');
dotenv.config();

const { authMiddleware, requiresAuth } = require('./middleware/auth');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at:', uploadsDir);
} else {
  console.log('Uploads directory exists at:', uploadsDir);
}
const upload = multer({ dest: uploadsDir });

const { generatePDF } = require('./latex');
const { analyzeImage } = require('./ai_resume');
const { generateCov } = require('./ai_cover');

app.use(cors({
  origin: ['http://localhost:3000', 'https://coversume-frontend.onrender.com',
           'https://coversume-frontend.onrender.com/#/*'],
  methods: ['GET', 'POST', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Custom callback redirect BEFORE auth middleware - this must come first!
app.get('/callback', (req, res) => {
  // Auth0 calls this after login, then redirect to frontend
  setTimeout(() => {
    res.redirect('http://localhost:3000');
  }, 100);
});

// Auth0 middleware
app.use(authMiddleware);

// Fix the static file serving path
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Check auth status endpoint
app.get('/check-auth', (req, res) => {
  res.json({ isAuthenticated: req.oidc.isAuthenticated() });
});

// profile route will return user profile information when logged in
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Fix the static file serving path
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.post('/generate-resume', requiresAuth(), async (req, res) => {
    try {
        console.log('Generating resume...');
        const formData = req.body;
        console.log('Received form data:', formData);
        
        await analyzeImage(formData);
        await generatePDF('resume');
        
        console.log('Sending response...');
        res.json({ url: "/resume-pdf" });
    } catch (error) {
        console.error('Error generating resume:', error);
        res.status(500).json({ 
            error: 'Failed to generate resume', 
            message: error.message 
        });
    }
});

app.post('/cover-letter', requiresAuth(), upload.single('resume'), async (req, res) => {
    try {
        console.log('Generating cover letter...');
        const formData = req.body;
        const file = req.file;
        console.log(file);
        console.log(file.path);
        await generateCov(formData, file.path);
        console.log(file.path);
        await generatePDF('cover');
        
        console.log('Sending response...');
        res.json({ url: "/cover-pdf" });
    } catch (error) {
        console.error('Error generating cover letter:', error);
        res.status(500).json({ 
            error: 'Failed to generate cover letter', 
            message: error.message 
        });
    }
});

app.get('/resume-pdf', (req, res) => {
    const filePath = path.join(__dirname, 'output.pdf');
    
    // Set proper headers for PDF display
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=resume.pdf');
    
    res.sendFile(filePath, err => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('PDF not found');
        }
    });
});

app.get('/cover-pdf', (req, res) => {
    const filePath = path.join(__dirname, 'outputCov.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=cover-letter.pdf');
    
    res.sendFile(filePath, err => {
        if (err) {
            console.error('Error sending cover PDF:', err);
            res.status(404).send('Cover letter PDF not found');
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
