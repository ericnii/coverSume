const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const fs = require('fs');
const multer = require('multer'); 

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

app.use(cors());
// Fix the static file serving path
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.post('/generate-resume', upload.single('resume'), async (req, res) => {
    try {
        console.log('Generating resume...');
        const formData = req.body;
        
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

app.post('/cover-letter', upload.single('resume'), async (req, res) => {
    try {
        console.log('Generating cover letter...');
        const formData = req.body;
        const file = req.file;
        
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
