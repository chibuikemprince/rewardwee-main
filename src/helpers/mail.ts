import { EmailData } from "./customTypes"
import { getEnv } from "./getEnv";

export const EMAIL_TEMPLATES = {
    ACCOUNT_ACTIVATION: "ACCOUNT_ACTIVATION_ID"
   }
  
   export const sendEmail = (data: EmailData): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {
  
      const { receiver, message, template, subject } = data;
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: getEnv("EMAIL"),
          pass: getEnv("EMAIL_PASSWORD")
        }
      });
  
      const mailOptions = {
        from: getEnv("EMAIL"),
        to: receiver,
        subject: subject,
        html: message
      };
  
      transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          console.log(error);
          reject(error);
          return;
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info);
          return;
        }
      });
    });
