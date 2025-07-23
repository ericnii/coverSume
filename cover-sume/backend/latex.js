const latex = require('node-latex');
const fs = require('fs');

function generatePDF(res_or_cl) {
  return new Promise((resolve, reject) => {    
    var input = null;
    var output = null;
    if (res_or_cl === 'resume') {
      input = fs.createReadStream('input.tex');
      output = fs.createWriteStream('output.pdf');
    } else {
      input = fs.createReadStream('inputCov.tex');
      output = fs.createWriteStream('outputCov.pdf');
    }

    const pdf = latex(input); 
    pdf.pipe(output);

    pdf.on('finish', () => {
      console.log('PDF generated!');
      resolve();
    });
    pdf.on('error', (err) => {
      console.error('PDF generation error:', err);
      reject(err);
    });
    output.on('error', (err) => {
      console.error('Output stream error:', err);
      reject(err);
    });
    input.on('error', (err) => {
      console.error('Input stream error:', err);
      reject(err);
    });
  });
}

module.exports = { generatePDF };