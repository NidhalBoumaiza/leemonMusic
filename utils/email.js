const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter :
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EmailMailer,
      pass: process.env.EmailPassword,
    },
  });
  // 2) Define the email options :
  const mailOptions = {
    from: process.env.EmailMailer,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
