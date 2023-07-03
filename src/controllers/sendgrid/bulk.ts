import sgMail, { MailDataRequired } from "@sendgrid/mail"; 
import { getEnv } from "../../helpers/getEnv";
import { RESPONSE_TYPE, SENDGRID_MULTIPLE_EMAIL_DATA, SENDGRID_MULTIPLE_EMAIL_DATA_WITH_TEMPLATE } from "../../helpers/customTypes";
import { ErrorDataType, LogError } from "../../helpers/errorReporting";
import {EmailData} from '@sendgrid/helpers/classes/email-address'

 
const SendGridApiKey = getEnv("SENDGRID_API_KEY") as string;

class MailService {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

   sendSingleEmailToMultiple(to: EmailData[], subject: string, text: string, html: string): Promise<RESPONSE_TYPE> {
    return new Promise((resolve: any, reject: any) => {
let from = getEnv("SENDER_EMAIL") as string;

    const msg = {
      to,
      from, // your email here
      subject,
      text,
      html,
    };
     
    sgMail.sendMultiple(msg)
        .then((res: any) => {
            let done: RESPONSE_TYPE = {
                data: [],
                message: "email sent successfully.",
                status: 200,
                statusCode: "SUCCESS"
            }
            resolve(done);
            return;
            }
        )
        .catch((err: any) => {

                console.log({err});

            let error_log: ErrorDataType = {            
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }
            LogError(error_log);

            let error: RESPONSE_TYPE = {
                data: [],
                message: "email not sent, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            }
            reject(error);
            return;

        });

    });

  }


  
  sendSingleEmailToMultipleWithTemplate (to: EmailData[], templateId: string, dynamicTemplateData: Record<string, unknown>): Promise<RESPONSE_TYPE> {
    return new Promise((resolve: any, reject: any) => {
let from = getEnv("SENDER_EMAIL") as string;



const msg = {
    to,
    from,
    templateId,
    dynamicTemplateData,
  };

    sgMail.sendMultiple(msg)
        .then((res: any) => {
            let done: RESPONSE_TYPE = {
                data: [],
                message: "email sent successfully.",
                status: 200,
                statusCode: "SUCCESS"
            }
            resolve(done);
            return;
            }
        )
        .catch((err: any) => {

            let error_log: ErrorDataType = {            
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }
            LogError(error_log);

            let error: RESPONSE_TYPE = {
                data: [],
                message: "email not sent, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            }
            reject(error);
            return;

        });

    });

  }

  sendDifferentEmailToMultipleRecipients (msg : SENDGRID_MULTIPLE_EMAIL_DATA[] ): Promise<RESPONSE_TYPE> {
    return new Promise((resolve: any, reject: any) => {
let from = getEnv("SENDER_EMAIL") as string;
     

sgMail.send(msg.map((item) => { item.from = from; return item;}) as MailDataRequired[])
        .then((res: any) => {
            let done: RESPONSE_TYPE = {
                data: [],
                message: "email sent successfully.",
                status: 200,
                statusCode: "SUCCESS"
            }
            resolve(done);
            return;
            }
        )
        .catch((err: any) => {

            let error_log: ErrorDataType = {            
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }
            LogError(error_log);

            let error: RESPONSE_TYPE = {
                data: [],
                message: "email not sent, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            }
            reject(error);
            return;

        });

    });

  }


  sendDifferentEmailToMultipleRecipientsWithTemplate (msg : SENDGRID_MULTIPLE_EMAIL_DATA_WITH_TEMPLATE[]): Promise<RESPONSE_TYPE> {
    return new Promise((resolve: any, reject: any) => {
let from = getEnv("SENDER_EMAIL") as string;
    


     sgMail.send(msg.map((item) => { item.from = from; return item;}) as MailDataRequired[])
        .then((res: any) => {
            let done: RESPONSE_TYPE = {
                data: [],
                message: "email sent successfully.",
                status: 200,
                statusCode: "SUCCESS"
            }
            resolve(done);
            return;
            }
        )
        .catch((err: any) => {

            let error_log: ErrorDataType = {            
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }
            LogError(error_log);

            let error: RESPONSE_TYPE = {
                data: [],
                message: "email not sent, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            }
            reject(error);
            return;

        });

    });

  }



}

export const BulkMailService = new MailService(SendGridApiKey);
