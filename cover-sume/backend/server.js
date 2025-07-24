const express = require('express');
const cors = require('cors');
const app = express();

// Basic CORS
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/test', (req, res) => {
  res.json({ message: 'POST endpoint working', body: req.body });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Minimal server running on port ${PORT}`);
});
