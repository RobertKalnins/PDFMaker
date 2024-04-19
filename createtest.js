const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to read file contents
function readFileContents(path) {
    return fs.readFileSync(path, 'utf8');
}

// Function to add multi-line text with optional bullet points
function addMultilineText(doc, textArray, bullet = false) {
    textArray.forEach(line => {
        line = line.trim(); // Trim each line to avoid unwanted whitespace
        if (bullet && line !== '') { // Only add bullet points to non-empty lines
            line = `• ${line}`;
        }
        doc.text(line, { align: 'left' });
        doc.moveDown(0.5);
    });
    doc.moveDown(1); // Extra space after each section
}

// Create Resume PDF
const resumeDoc = new PDFDocument({ margin: 50 });
resumeDoc.pipe(fs.createWriteStream('resume.pdf'));

// Set a uniform font for the entire document
resumeDoc.font('Helvetica');

// Add Header
resumeDoc.fontSize(20).text('Your Name', { align: 'center' });
resumeDoc.fontSize(12).text('Address | Email | Phone', { align: 'center' });
resumeDoc.moveDown(2);

// Section headers and content
const sections = {
    'Professional Summary': readFileContents('ProfessionalSummary.txt').split('\n'),
    'Experience': readFileContents('Experience.txt').split('\n'),
    'Education': readFileContents('Education.txt').split('\n'),
    'Skills': readFileContents('Skills.txt').split('\n')
};

Object.keys(sections).forEach(section => {
    resumeDoc.fontSize(14).font('Helvetica-Bold').text(section, { underline: true });
    resumeDoc.fontSize(10).font('Helvetica');
    addMultilineText(resumeDoc, sections[section], section === 'Skills' || section === 'Experience');
});

// Finalize Resume PDF
resumeDoc.end();

// Create Cover Letter PDF
const coverDoc = new PDFDocument({ margin: 50 });
coverDoc.pipe(fs.createWriteStream('coverletter.pdf'));

// Setup fonts and sizes for the cover letter
coverDoc.font('Helvetica');
coverDoc.fontSize(16).font('Helvetica-Bold').text('Cover Letter', { underline: true });
coverDoc.moveDown(0.5);
coverDoc.fontSize(12).font('Helvetica');

// Read content from the cover letter file
const coverLetter = readFileContents('coverletter.txt').split('\n');
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