const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to read file contents
function readFileContents(path) {
    return fs.readFileSync(path, 'utf8');
}

// Function to add multi-line text
function addMultilineText(doc, textArray) {
    textArray.forEach(line => {
        doc.text(line.trim(), { align: 'justify' });
        doc.moveDown(0.5);
    });
    doc.moveDown(1); // Extra space after each section
}

// Create Resume PDF
const resumeDoc = new PDFDocument();
resumeDoc.pipe(fs.createWriteStream('resume.pdf'));

// Read content from files for resume
const professionalSummary = readFileContents('ProfessionalSummary.txt').split('\n');
const experience = readFileContents('Experience.txt').split('\n');
const education = readFileContents('Education.txt').split('\n');
const skills = readFileContents('Skills.txt').split('\n');  // Assuming each skill is on a new line

// Add content to the Resume PDF
resumeDoc.fontSize(20).text('Your Name', { align: 'center' });
resumeDoc.fontSize(12).text('Address | Email | Phone', { align: 'center' });
resumeDoc.moveDown(1);

resumeDoc.fontSize(14).text('Professional Summary', { underline: true });
resumeDoc.fontSize(10);
addMultilineText(resumeDoc, professionalSummary);

resumeDoc.fontSize(14).text('Experience', { underline: true });
resumeDoc.fontSize(10);
addMultilineText(resumeDoc, experience);

resumeDoc.fontSize(14).text('Education', { underline: true });
resumeDoc.fontSize(10);
addMultilineText(resumeDoc, education);

resumeDoc.fontSize(14).text('Skills', { underline: true });
resumeDoc.fontSize(10);
skills.forEach(skill => {
    resumeDoc.text(skill.trim(), { align: 'left' });
    resumeDoc.moveDown(0.2);
});

// Finalize Resume PDF
resumeDoc.end();

// Create Cover Letter PDF
const coverDoc = new PDFDocument();
coverDoc.pipe(fs.createWriteStream('coverletter.pdf'));

// Read content from cover letter file
const coverLetter = readFileContents('coverletter.txt').split('\n');

// Setup fonts and sizes for the cover letter
coverDoc.fontSize(16).font('Helvetica-Bold').text('Cover Letter', { underline: true });
coverDoc.moveDown(0.5);
coverDoc.fontSize(12).font('Helvetica');

// Print each line with appropriate spacing
coverLetter.forEach(line => {
    coverDoc.text(line.trim(), { align: 'left' });
    coverDoc.moveDown(0.5);
});

// Enhance the closing signature
coverDoc.moveDown(1);
coverDoc.fontSize(12).font('Helvetica-Bold').text('John Doe', { align: 'left' });
coverDoc.fontSize(12).font('Helvetica').text('john.doe@example.com', { align: 'left' });

// Finalize Cover Letter PDF
coverDoc.end();
