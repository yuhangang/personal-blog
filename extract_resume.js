const fs = require('fs');
const pdfParse = require('pdf-parse');

console.log('Exports:', JSON.stringify(pdfParse, null, 2));

let dataBuffer = fs.readFileSync('public/resume.pdf');

if (typeof pdfParse === 'function') {
    pdfParse(dataBuffer).then(function (data) {
        console.log(data.text);
    });
} else {
    // Fallback if it exports default
    if (pdfParse.default && typeof pdfParse.default === 'function') {
        pdfParse.default(dataBuffer).then(function (data) {
            console.log(data.text);
        });
    } else {
        console.error('pdf-parse did not export a function');
    }
}
