const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const Resume = '../public/resume.png';
const Reference = '../public/ref.tex';

async function analyzeImage(formData) {
  const imageBuffer = fs.readFileSync(Resume);
  const base64Image = imageBuffer.toString("base64");
  const referenceContent = fs.readFileSync(Reference, 'utf8');

  // Build a LaTeX-formatted userInfo block matching the reference
  function latexEscape(str) {
    if (!str) return '';
    return str.replace(/([%$&#_{}~^\\])/g, '\\$1');
  }
  
  const headerBlock = `
%header
\\begin{center}
    \\textbf{\\huge{${latexEscape(formData.name)}}} 
\\end{center}
\\begin{center}
    \\small {${latexEscape(formData.city)} $|$ ${latexEscape(formData.phone)} $|$ \\underline{${latexEscape(formData.email)}} $|$ \\underline{\\href{${latexEscape(formData.linkedin)}}{LinkedIn}} $|$ \\underline{\\href{${latexEscape(formData.github)}}{GitHub}}}
\\end{center}
`;

  // Skills
  const skillsBlock = `
\\section*{\\textnormal{TECHNICAL SKILLS}}\\vspace{-19pt}
\\noindent\\rule{\\textwidth}{0.4 pt}
${latexEscape(formData.skills)}
`;

  // Education
  const educationBlock = Array.isArray(formData.education) && formData.education.length > 0 ? `
\\section*{\\textnormal{EDUCATION}}\\vspace{-19pt}
\\rule{\\textwidth}{0.4 pt}
` + formData.education.map(edu => `
\\noindent\\textbf{${latexEscape(edu.education)}}
\\hfill
${latexEscape(edu.city || '')} \\\\
\\emph{${latexEscape(edu.degree)}}
\\hfill
\\emph{${latexEscape(edu.grad || '')}}
${edu.points ? `\\begin{itemize}
    \\setlength\\itemsep{1pt}
    \\item ${latexEscape(edu.points)}
\\end{itemize}` : ''}
`).join('\n') : '';

  // Experience
  const experienceBlock = Array.isArray(formData.experiences) && formData.experiences.length > 0 ? `
\\section*{\\textnormal{EXPERIENCE}}\\vspace{-19pt}
\\rule{\\textwidth}{0.2 pt}
` + formData.experiences.map(exp => `
\\vspace{5pt}
\\noindent\\textbf{${latexEscape(exp.jobTitle)}}${exp.jobSkills ? ` $|$ ${latexEscape(exp.jobSkills)}` : ''}
\\hfill
${latexEscape(exp.duration)}\\\\
\\emph{${latexEscape(exp.company)}}
\\hfill
\\emph{${latexEscape(exp.location || '')}}
\\begin{itemize}
    \\setlength\\itemsep{1pt}
    \\item ${latexEscape(exp.jobDescription)}
\\end{itemize}
`).join('\n') : '';

  // Projects
  const projectsBlock = Array.isArray(formData.project) && formData.project.length > 0 ? `
\\section*{\\textnormal{PROJECTS}}\\vspace{-19pt}
\\noindent\\rule{\\textwidth}{0.2 pt}
` + formData.project.map(proj => `
\\noindent\\textbf{${latexEscape(proj.projectName)}}${proj.projectSkills ? ` $|$ ${latexEscape(proj.projectSkills)}` : ''}
\\hfill
${latexEscape(proj.projectDate || '')}
\\begin{itemize}
    \\setlength\\itemsep{1pt}
    \\item ${latexEscape(proj.projectDescription)}
\\end{itemize}
\\vspace{5pt}
`).join('\n') : '';

  const userInfoLatex = `${headerBlock}\n${skillsBlock}\n${educationBlock}\n${experienceBlock}\n${projectsBlock}`;

  console.log(userInfoLatex);
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `Here is a reference LaTeX resume template (for structure and formatting ONLY):\n${referenceContent}\n\nHere is the user data in LaTeX format (use this to fill in the template):\n${userInfoLatex}\n\nIMPORTANT:\n\n- USE THE USER DATA ABOVE TO REPLACE THE EXAMPLE VALUES IN THE REFERENCE.\n- ONLY output valid LaTeX code, nothing else.\n- DO NOT add any text before or after the LaTeX code.\n- DO NOT add code fences (no \`\`\`latex or \`\`\`).\n- The output MUST compile in Overleaf.\n- **PLEASE NO SPACES INBETWEEN LINES.**\n- **NO INDENTS.**\n- DO NOT add explanations, comments, or extra formatting.\n- DO NOT add a statement at the start or end of the LaTeX file.\n- Repeat: NO code fences, NO extra text, ONLY valid LaTeX, and use the user data above. DO NOT combine all the points into one bullet point. PLEASE USE seperate bullet points. Have a \\\\noindent for each jobTitle and projectName.\n` },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
            },
          },
        ],
        temperature: 0,
      },
    ],
  });

  let latexContent = response.choices[0].message.content;

  // Remove all blank lines (lines that are only whitespace)
  latexContent = latexContent.replace('\\vspace{5pt}', '');
  // Remove leading spaces (indents) from each line
  latexContent = latexContent.replace(/^ +/gm, '');
  // Optionally, trim leading/trailing whitespace
  latexContent = latexContent.trim();

  fs.writeFileSync('input.tex', latexContent, 'utf8');
  console.log('LaTeX code saved to input.tex');
}

module.exports = { analyzeImage };


