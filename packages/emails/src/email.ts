import { createTransport, SendMailOptions } from "nodemailer";
import { config } from "dotenv";
config();

interface MailOptions {
  from: SendMailOptions["from"];
  to: SendMailOptions["to"];
  subject: SendMailOptions["subject"];
  html: SendMailOptions["html"];
}

export const sendEmail = async (options: MailOptions) => {
  console.log("process.env.UPTIME_APP_EMAIL", process.env.UPTIME_APP_EMAIL);
  createTransport({
    host: "smtp-mail.outlook.com",
    service: "gmail",
    auth: {
      user: process.env.UPTIME_APP_EMAIL,
      pass: process.env.UPTIME_APP_PASSWORD,
    },
  }).sendMail(options);
};
