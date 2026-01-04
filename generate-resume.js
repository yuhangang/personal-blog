const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    // Set viewport to A4 dimensions (approx 794px width) to minimize reflow/scaling differences
    await page.setViewport({ width: 794, height: 1123 });

    try {
        // Navigate to the resume-view page
        console.log('Navigating to http://localhost:3000/resume-view...');
        await page.goto('http://localhost:3000/resume-view', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for any entry animations (Template.tsx has 1.2s duration)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate PDF
        const pdfPath = path.join(__dirname, 'public', 'resume.pdf');
        console.log(`Generating PDF at ${pdfPath}...`);

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });

        console.log('PDF generated successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        await browser.close();
    }
})();
