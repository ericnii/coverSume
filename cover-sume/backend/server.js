const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

const multer = require('multer'); 

// Create uploads directory if it doesn't exist
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

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'https://coversume-frontend.onrender.com',
      'https://coversume.onrender.com' // Your backend URL (for testing)
    ];
    
    console.log('Request origin:', origin);
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS would block origin:', origin, '- but allowing for debug');
      callback(null, true); // Still allowing all for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'multipart/form-data'],
};

app.use(cors(corsOptions));

// Add preflight handling
app.options('*', cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.get('Origin'));
  console.log('Content-Type:', req.get('Content-Type'));
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.post('/generate-resume', upload.single('resume'), async (req, res) => {
    try {
        console.log('Generating resume...');
        const formData = req.body;
        await analyzeImage(formData);
        await generatePDF('resume');
        
        console.log('Sending response...');
        res.json({ url: "/resume-pdf" });
    } catch (error) {
        console.error('Resume generation error:', error);
        res.status(500).json({ error: 'Failed to generate resume' });
    }
});

// Test endpoint for file uploads
app.post('/test-upload', upload.single('resume'), (req, res) => {
    console.log('=== TEST UPLOAD DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('========================');
    
    res.json({
        hasFile: !!req.file,
        file: req.file,
        body: req.body,
        contentType: req.get('Content-Type')
    });
});

app.post('/cover-letter', upload.single('resume'), async (req, res) => {
    try {
        console.log('=== COVER LETTER REQUEST DEBUG ===');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request files:', req.files);
        console.log('Content-Type:', req.get('Content-Type'));
        console.log('================================');
        
        const formData = req.body;
        const file = req.file;
        
        if (!file) {
            console.log('❌ No file received in request');
            console.log('Available fields in body:', Object.keys(req.body || {}));
            return res.status(400).json({ 
                error: 'No file uploaded. Make sure to send a file with field name "resume"',
                receivedFields: Object.keys(req.body || {}),
                contentType: req.get('Content-Type')
            });
        }
        
        console.log('✅ File received:', file.filename, 'at path:', file.path);
        
        await generateCov(formData, file.path);
        await generatePDF('cover');
        console.log('Cover letter generated successfully');

        res.json({ url: "/cover-pdf" });
    } catch (error) {
        console.error('Cover letter generation error:', error);
        res.status(500).json({ error: 'Failed to generate cover letter: ' + error.message });
    }
});

app.get('/resume-pdf', (req, res) => {
    const filePath = path.join(__dirname, 'output.pdf');
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'PDF not found' });
    }
    
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
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Cover letter PDF not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=cover-letter.pdf');
    res.sendFile(filePath, err => {
        if (err) {
            console.error('Error sending cover letter file:', err);
            res.status(404).send('Cover letter PDF not found');
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
