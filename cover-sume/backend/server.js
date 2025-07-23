const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const multer = require('multer'); 
const upload = multer({ dest: 'uploads/' })


const { generatePDF } = require('./latex');
const { analyzeImage } = require('./ai_resume');
const { generateCov } = require('./ai_cover');

app.use(cors());
app.use(express.static('../public'));
app.use(express.json());

app.post('/generate-resume', upload.single('resume'), async (req, res) => {
    console.log('Generating resume...');
    const formData = req.body;
    await analyzeImage(formData);
    await generatePDF('resume');
    
    console.log('Sending response...');
    res.json({ url: "/resume-pdf" });
});

app.post('/cover-letter', upload.single('resume'), async (req, res) => {
  const formData = req.body;
  const file = req.file;
  await generateCov(formData, file.path);
  await generatePDF('cover');
  console.log('Generating cover letter...');

  console.log('Sending response...');
  res.json({ url: "/cover-pdf" });
})

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
  res.sendFile(filePath);
})

app.listen(3001, () => {
    console.log(`Server running on http://localhost:3001`);
}); 
