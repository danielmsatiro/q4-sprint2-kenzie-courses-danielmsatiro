import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e236d574750577",
    pass: "ed045f851a9bfe",
  },
});

export default transport;
