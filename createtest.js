const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to read file contents
function readFileContents(path) {
    return fs.readFileSync(path, 'utf8');
}

// Create a new PDF document
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('resume.pdf'));

// Read content from files
const professionalSummary = readFileContents('ProfessionalSummary.txt').split('\n');
const experience = readFileContents('Experience.txt').split('\n');
const education = readFileContents('Education.txt').split('\n');
const skills = readFileContents('Skills.txt').split('\n');  // Assuming each skill is on a new line

// Add content to the PDF
doc.fontSize(20).text('Your Name', { align: 'center' });
doc.fontSize(12).text('Address | Email | Phone', { align: 'center' });
doc.moveDown(1);

function addMultilineText(textArray) {
    textArray.forEach(line => {
        doc.text(line.trim(), { align: 'justify' });
        doc.moveDown(0.5);
    });
    doc.moveDown(1); // Extra space after each section
}

// Professional Summary
doc.fontSize(14).text('Professional Summary', { underline: true });
doc.fontSize(10);
addMultilineText(professionalSummary);

// Experience
doc.fontSize(14).text('Experience', { underline: true });
doc.fontSize(10);
addMultilineText(experience);

// Education
doc.fontSize(14).text('Education', { underline: true });
doc.fontSize(10);
addMultilineText(education);

// Skills - Assuming each skill is on a new line, but treated differently since they are short
doc.fontSize(14).text('Skills', { underline: true });
doc.fontSize(10);
skills.forEach(skill => {
    doc.text(skill.trim(), { align: 'left' });  // Apply trim() to remove unwanted whitespace or characters
    doc.moveDown(0.2);
});


// Finalize PDF file
doc.end();
