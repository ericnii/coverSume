const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const fs = require('fs');
const multer = require('multer'); 
const dotenv = require('dotenv');
dotenv.config();

const { generatePDF } = require('./latex');
const { analyzeImage } = require('./ai_resume');
const { generateCov } = require('./ai_cover');
const { uploadToS3, getUserFiles, getPresignedUrl } = require('./s3-upload');

app.use(cors({
  origin: ['http://localhost:3000', 'https://coversume-frontend.onrender.com',
           'https://coversume-frontend.onrender.com/#/*'],
  methods: ['GET', 'POST', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Fix the static file serving path
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// Status endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Profile endpoint
app.get('/profile', (req, res) => {
  res.send(JSON.stringify({ message: 'Profile endpoint' }));
});

// Fix the static file serving path
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// Multer setup for temporary file storage
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const upload = multer({ dest: uploadsDir });

app.post('/generate-resume', async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
          return res.status(400).json({ error: 'userId is required' });
        }

        console.log(`Generating resume for user: ${userId}`);
        const formData = req.body;
        
        await analyzeImage(formData);
        await generatePDF('resume');
        
        // Upload to S3
        const pdfPath = path.join(__dirname, 'output.pdf');
        const s3Url = await uploadToS3(userId, pdfPath, 'resume');
        
        console.log('Resume uploaded to S3');
        res.json({ url: s3Url });
    } catch (error) {
        console.error('Error generating resume:', error);
        res.status(500).json({ 
            error: 'Failed to generate resume', 
            message: error.message 
        });
    }
});

app.post('/cover-letter', upload.single('resume'), async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
          return res.status(400).json({ error: 'userId is required' });
        }

        console.log(`Generating cover letter for user: ${userId}`);
        const formData = req.body;
        const file = req.file;
        
        await generateCov(formData, file.path);
        await generatePDF('cover');
        
        // Upload to S3
        const pdfPath = path.join(__dirname, 'outputCov.pdf');
        const s3Url = await uploadToS3(userId, pdfPath, 'cover');
        
        console.log('Cover letter uploaded to S3');
        res.json({ url: s3Url });
    } catch (error) {
        console.error('Error generating cover letter:', error);
        res.status(500).json({ 
            error: 'Failed to generate cover letter', 
            message: error.message 
        });
    }
});

// Get user's files from S3
app.get('/user-files', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
          return res.status(400).json({ error: 'userId is required' });
        }

        const files = await getUserFiles(userId);
        res.json({ files });
    } catch (error) {
        console.error('Error fetching user files:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// Get presigned URL for a file
app.get('/get-presigned-url', async (req, res) => {
    console.log('Received request for presigned URL with query:', req.query);
    try {
        const { s3Key } = req.query;
        if (!s3Key) {
          return res.status(400).json({ error: 's3Key is required' });
        }

        const presignedUrl = await getPresignedUrl(s3Key, 3600); // 1 hour expiration
        res.json({ url: presignedUrl });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate download link' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
