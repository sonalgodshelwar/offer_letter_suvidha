const path = require('path');
const fs = require('fs');
const { populatePDF } = require('../scripts/populateLetter');
const { sendMail } = require('../controllers/mailController.js'); // Import sendMail function

// Define the absolute path of the current directory
const currentDir = path.resolve();

// Endpoint to generate PDF and send URL in response
const createPDFandDownload = async (req, res) => {
  try {
    const { uid, salutation, name, post, start, end, email } = req.body;

    console.log("Received data:", req.body);

    if (!name) {
      throw new Error("Name field is required.");
    }

    const outputPDFPath = path.join(currentDir, `../out/${name}.pdf`);
    const outputDir = path.dirname(outputPDFPath);

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Populate the PDF
    await populatePDF(
      path.join(currentDir, '/assets/offer-letter-template.pdf'),
      outputPDFPath,
      req.body
    );

    // Check if the file exists and send the URL
    if (fs.existsSync(outputPDFPath)) {
      // Create a relative URL for the PDF
      const relativePath = path.relative(currentDir, outputPDFPath).replace(/\\/g, '/'); // Use forward slashes for URL
      const pdfUrl = `http://localhost:8000/${relativePath}`; // Adjust the URL if needed

      await res.json({ pdfUrl });
    } else {
      res.status(404).json({ message: "PDF file not found." });
    }
  } catch (error) {
    console.error("Error creating or sending PDF:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error creating or sending PDF: " + error.message });
    }
  }
};

const createPDFandMail = async (req, res) => {
  try {
    const { uid, salutation, name, post, start, end, email, currentDate } = req.body;

    console.log("Received data:", req.body);

    if (!name || !email) {
      throw new Error("Name and email fields are required.");
    }

    const outputPDFPath = path.join(currentDir, `../out/${name}.pdf`);
    const outputDir = path.dirname(outputPDFPath);

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Populate the PDF
    await populatePDF(
      path.join(currentDir, '/assets/offer-letter-template.pdf'),
      outputPDFPath,
      req.body
    );

    const subject = "Re: Suvidha Offer Letter";
    const text = `
      Dear intern,

      Greetings of the day!!!

      Congratulations on your offer from Suvidha Foundation!
      Please find the attached - detailed offer letter.

      For the process of acceptance, Please revert back the physically signed copy of the Offer Letter within 48 hours.
      Email us here back: hr@suvidhafoundationedutech.org

      After Successful Completion of your internship, You will be Awarded with "Certificate of Completion" And on the basis of your Performance "Letter of Recommendation".

      We are looking forward to hearing from you and hope you'll join our team!

      Best regards,

      Human Resource Team
      Mail: suvidhafoundation00@gmail.com
      hr@suvidhafoundationedutech.org
      Suvidha Foundation
      R. No: MH/568/95/Nagpur
      H.No. 1951, W.N.4, Khaperkheda, Saoner, Nagpur
      Email: info@suvidhafoundationedutech.org
    `;

    // Send email using transport configuration from another file
    console.log("Sending email with data:", req.body);
    await sendMail({
      from: 'Suvidha Foundation <no-reply@suvidhafoundationedutech.org>',
      to: email,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: `${name}.pdf`,
          path: outputPDFPath,
          contentType: "application/pdf",
        },
      ],
    });

    // Check if the file exists and send the URL
    if (fs.existsSync(outputPDFPath)) {
      // Create a relative URL for the PDF
      const relativePath = path.relative(currentDir, outputPDFPath).replace(/\\/g, '/'); // Use forward slashes for URL
      const pdfUrl = `http://localhost:8000/${relativePath}`; // Adjust the URL if needed

      await res.json({ pdfUrl });
    } else {
      res.status(404).json({ message: "PDF file not found." });

      fs.unlink(outputPDFPath, (err) => {
        if (err) {
          console.error("Error deleting the PDF file:", err.message);
        } else {
          console.log("PDF file deleted successfully.");
        }
      });
    }
  } catch (error) {
    console.error("Error creating or sending PDF:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error creating or sending PDF: " + error.message });
    }
  }
};

module.exports = { createPDFandDownload, createPDFandMail };
