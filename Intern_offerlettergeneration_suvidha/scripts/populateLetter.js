const path = require("path");
const fs = require("fs/promises");
const { PDFDocument, StandardFonts } = require("pdf-lib");

async function setFontAndSize(field, font, fontSize) {
  const fontSizeStr = fontSize.toString();
  const fontDict = {
    Helvetica: StandardFonts.Helvetica,
    HelveticaBold: StandardFonts.HelveticaBold,
  };
  const fontRef = fontDict[font] || StandardFonts.Helvetica;
  const appearanceString = `/${fontRef.name} ${fontSizeStr} Tf`; // Ensure proper font reference
  
  // Set the default appearance string
  field.acroField.setDefaultAppearance(appearanceString);
  
  console.log(`Set font size to ${fontSize} and font ${font} for field with appearance: ${appearanceString}`);
}

const formatDate = (date) => {
  try {
    if (!date) {
      throw new Error("No date provided");
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date");
    }

    const day = parsedDate.getUTCDate().toString().padStart(2, '0');
    const month = parsedDate.toLocaleString('default', { month: 'long' }); // Full month name
    const year = parsedDate.getUTCFullYear();

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error.message);
    throw error;
  }
};


async function populatePDF(input, output, data) {
  try {
    await fs.access(input);
    const existingPdfBytes = await fs.readFile(input);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get form fields
    const internName = form.getTextField("internName");
    const inviteToDomain = form.getTextField("inviteToDomain");
    const domainName = form.getTextField("domainName");
    const durationOfInternship = form.getTextField("durationOfInternship");
    const currentDate = form.getTextField("currentDate");
    const refNo = form.getTextField("refNo");

    // Prepare text fields
    const longMessage = `We are pleased to offer you the position of "${data.post} Intern" at Suvidha Foundation (Suvidha Mahila Mandal) with the following terms and conditions:`;
    const shortMessage = `${data.post} Services and Social Activities`;

    const formattedDateOfJoining = formatDate(data.start);
    const formattedDateOfCompletion = formatDate(data.end);

    // Populate text fields
    internName.setText(data.name);
    inviteToDomain.setText(longMessage);
    domainName.setText(shortMessage);
    durationOfInternship.setText(`${formattedDateOfJoining} to ${formattedDateOfCompletion}`);
    currentDate.setText(data.currentDate);
    refNo.setText(data.uid);

    // Define font sizes
    const fontSize = 10; // Adjust font size
    const largerFontSize = 12; // Adjust larger font size

    // Define fields and their respective font sizes and types
    const fields = [
      { field: internName, size: fontSize, font: boldFont }, // Set bold font
      { field: inviteToDomain, size: largerFontSize, font: regularFont },
      { field: domainName, size: fontSize, font: regularFont },
      { field: durationOfInternship, size: fontSize, font: regularFont },
      { field: currentDate, size: fontSize, font: boldFont }, // Set bold font
      { field: refNo, size: fontSize, font: boldFont }, // Set bold font
    ];

    // Apply font size and type to each field
    for (const { field, size, font } of fields) {
      await setFontAndSize(field, font, size);
    }
    internName.defaultUpdateAppearances(boldFont);
    currentDate.defaultUpdateAppearances(boldFont);
    refNo.defaultUpdateAppearances(boldFont);
    refNo.defaultUpdateAppearances(boldFont);


    // Enable multiline for inviteToDomain and flatten form
    inviteToDomain.enableMultiline();
    form.flatten();

    // Save the populated PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(output, pdfBytes);
    console.log("PDF created successfully.");
  } catch (err) {
    console.error("Error creating PDF:", err.message); // Print only the error message
  }
}

module.exports = { populatePDF };
