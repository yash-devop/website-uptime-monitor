import { createTransport , SendMailOptions } from "nodemailer"

interface MailOptions {
    from: SendMailOptions["from"],
    to: SendMailOptions["to"],
    subject: SendMailOptions["subject"],
    html: SendMailOptions["html"]
}

export const sendEmail = async (options: MailOptions) => {
    createTransport({
        host: "smtp-mail.outlook.com",
        service: "gmail",
        auth: {
            user: process.env.UPTIME_APP_EMAIL,
            pass: process.env.UPTIME_APP_PASSWORD   
        }
    }).sendMail(options)
}