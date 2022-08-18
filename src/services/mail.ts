import * as nodemailer from "nodemailer";

const host = process.env.MAIL_HOST ? process.env.MAIL_HOST : "localhost";
const port = Number(process.env.MAIL_PORT)
  ? Number(process.env.MAIL_PORT)
  : 1025;
const secure = process.env.MAIL_TLS == "true" ? true : false;
const user = process.env.MAIL_USER ?? "null";
const pass = process.env.MAIL_PASSWORD ?? "null";

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: secure, // use TLS
  auth: {
    user: user,
    pass: pass,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// const mailOptions = {
//   from: "youremail@gmail.com",
//   to: "myfriend@yahoo.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// });

const sendEmail = (
  to: string = process.env.MAIL_FROM,
  from: string = process.env.MAIL_FROM,
  subject: string = "Email from " + process.env.APP_NAME,
  text: string = "Message from " + process.env.APP_NAME
) => {
  transporter.sendMail(
    {
      to,
      from,
      subject,
      text,
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};

export default sendEmail;
