const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter :
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d62cec3caec769",
      pass: "3ef3ae9da561a7",
    },
  });
  // 2) Define the email options :
  const mailOptions = {
    from: "Nidhal Boumaiza <Nidhalbmz123@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
