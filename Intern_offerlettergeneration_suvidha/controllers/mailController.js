const nodemailer = require('nodemailer');
// const config=require('../config/config.json')
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS 
    }
});

exports.sendMail =async (mailOptions) => {
   

  
    try {
        await transporter.sendMail(mailOptions);
        console.log("email has been sent.");
      } catch (err) {
        console.log("some error occurred: ", err);
      }
};
