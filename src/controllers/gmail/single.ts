import { EmailData, RESPONSE_TYPE } from "../../helpers/customTypes"
import { ErrorDataType, LogError } from "../../helpers/errorReporting";
import { getEnv } from "../../helpers/getEnv";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({
  path: "../../../.env"
});
  
   export const sendEmailGmailSIngle = (data: EmailData): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {
  
      const { receiver, message, template, subject } = data;
  console.log({
    user: getEnv("GMAIL_SENDER_EMAIL") as string,
    pass: getEnv("GMAIL_SENDER_PASSWORD") as string
  })
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        
        auth: {
          user: getEnv("GMAIL_SENDER_EMAIL") as string,
          pass: getEnv("GMAIL_SENDER_PASSWORD") as string
        },
        tls: {
          rejectUnauthorized: false
        }

      });
  
      const mailOptions = {
        from: getEnv("GMAIL_SENDER_EMAIL") as string,
        to: receiver,
        subject: subject,
        html: message
      };
  
      transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          console.log(error);
          let err: RESPONSE_TYPE ={
            data:[],
            message: "email not sent, please try again.",
            status: 500,
            statusCode: "UNKNOWN_ERROR"

          }
          reject(err);

          let error_log: ErrorDataType = {
            msg: ` error from sendEmail, Error: ${error.message}`,
            status:"STRONG",
            time: new Date().toUTCString(),
            stack: error.stack
      
          }

          LogError(error_log);
          return;
        } else {
          console.log('Email sent: ' + info.response);

          let res:RESPONSE_TYPE = {
            data:[],
            message: "email sent successfully.",
            status:200,
            statusCode: "SUCCESS"
          }
          resolve(res);
          return;
        }


      });



    })

  }

/* 
  sendEmailGmailSIngle({
    receiver: "youngprince042@gmail.com",
    message: "hello world",
    subject: "test",
    template: "ACCOUNT_ACTIVATION"
  }).then((res: RESPONSE_TYPE) => {
    console.log(res);
  }
  ).catch((err: RESPONSE_TYPE) => {
    console.log(err);
  } 
  ) */