import sgMail from "@sendgrid/mail"; 
import { getEnv } from "../../helpers/getEnv";
import { RESPONSE_TYPE } from "../../helpers/customTypes";
import { ErrorDataType, LogError } from "../../helpers/errorReporting";
import {EmailData} from '@sendgrid/helpers/classes/email-address'
import {MailDataRequired } from '@sendgrid/helpers/classes/mail' 

/* 

import {MailService} from '@sendgrid/mail' 

*/

 /*  import dotenv from 'dotenv' 
dotenv.config({path:__dirname+'/./../../../.env'})
  */ 

const SendGridApiKey = getEnv("SENDGRID_API_KEY") as string;
//console.log({SendGridApiKey})
class MailService {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

   sendEmail(to: string, subject: string, text: string, html?: string): Promise<RESPONSE_TYPE> {
    return new Promise((resolve: any, reject: any) => {
let from = getEnv("SENDER_EMAIL") as string;
    const msg = {
      to,
      from, // your email here
      subject,
      text,
      html
    };

     sgMail.send(msg)
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


 
//SENDGRID_MULTIPLE_EMAIL_DATA
  
  sendEmailWithTemplate (to: EmailData, templateId: string, dynamicTemplateData: Record<string, unknown>): Promise<RESPONSE_TYPE> {
    return new Promise((resolve: any, reject: any) => {
let from = getEnv("SENDER_EMAIL") as string;
const msg:  MailDataRequired = {
    to,
    from: getEnv("SENDER_EMAIL") as string,
    templateId,
    dynamicTemplateData,
  };

   sgMail.send(msg)
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

export const SingleMailService = new MailService(SendGridApiKey);

/* 
SingleMailService.sendEmailWithTemplate("soesitsocials@gmail.com", "d-fda47418ee0941f0838d11037bf5b283", {firstName:"soe", lastName:"socials", code:"123456"})
    .then((res: any) => {
        console.log({ res, done:"done"});
    })
    .catch((err: any) => {
        console.log({err, done:"done with error"});
    })

 */



 
