import nodemailer from "nodemailer";

import * as dotenv from "dotenv";

dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: parseInt(process.env.NODEMAILER_PORT),
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export default transport;
