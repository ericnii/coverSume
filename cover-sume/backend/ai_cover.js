const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const Cover = '../public/cover.pdf';
const CovRef = '../public/ref_cov.tex';

async function generateCov(formData, file) {
    const imageBuffer = fs.readFileSync(Cover);
    const base64Image = imageBuffer.toString("base64");

    const resumeBuffer = fs.readFileSync(file);
    const base64Resume = resumeBuffer.toString("base64");

    const referenceContent = fs.readFileSync(CovRef, 'utf8');

    const userInfo = `
    Name: ${formData.name || 'Not provided'}
    Location: ${formData.location || 'Not provided'}
    Phone: ${formData.phone || 'Not provided'}
    Email: ${formData.email || 'Not provided'}
    LinkedIn: ${formData.linkedin || 'Not provided'}
    GitHub: ${formData.github || 'Not provided'}
    Company Name: ${formData.companyName || 'Not provided'}
    Company Address: ${formData.companyAddress || 'Not provided'}
    Job Position: ${formData.jobPosition || 'Not provided'}
    Hiring Manager: ${formData.hiringManager || 'Hiring Manager'}`;

    console.log(userInfo);

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `Please generate a cover letter latex code similar to: ${referenceContent}. On top of that, here is the user's inputted form info: ${userInfo}. DO NOT add any text at the start or end. ONLY VALID LATEX CODE. DO NOT add \`\`\`latex at the start and \`\`\ at the end. Many parts in the reference latex files have {} where you must replace it. Please replace the filler text with something meaningful and relavant to the cover letter. If the hiring manager's name is not known, then don't include it the first time in bold, only after Dear.` },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64Resume}`,
                },
              },
            ],
            temperature: 0,
          },
        ],
    });

    let latexContent = response.choices[0].message.content;
    fs.writeFileSync('inputCov.tex', latexContent, 'utf8');
    console.log('LaTeX code saved to inputCov.tex');

}

module.exports = { generateCov };