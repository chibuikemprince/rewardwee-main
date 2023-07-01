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
    console.log({msg})
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
/* 
BulkMailService.sendSingleEmailToMultiple( [
    {email: "soesitsocials@gmail.com"},
                {email: "ejecsofficial@gmail.com"},
                {email: "soesitintellect@gmail.com"}

], 
 "EMAIl Microservice type bulk without template 2",
"Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns."
, "<h1> Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>")

 */
/* 
BulkMailService.sendSingleEmailToMultipleWithTemplate([
    {email: "soesitsocials@gmail.com"},
                {email: "ejecsofficial@gmail.com"},
                {email: "soesitintellect@gmail.com"}

],   "d-fda47418ee0941f0838d11037bf5b283",
 {firstName:"soe", lastName:"socials", code:"new"}

)
 */

/* 
BulkMailService.sendDifferentEmailToMultipleRecipients([

    {
        to: "soesitsocials@gmail.com", 
        subject: "EMAIl Microservice bULK mULTIPLE Test 4",
        text: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.",
        html: "<h1>Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>"

    },

    {
        to: " ejecsofficial@gmail.com", 
        subject: "EMAIl Microservice bULK mULTIPLE Test 4",
        text: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.",
        html: "<h1>Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>"

    },
    {
        to: "victorkelechi911@gmail.com", 
        subject: "EMAIl Microservice bULK mULTIPLE Test 3",
        text: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.",
        html: "<h1>Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>"

    }
])

 */


/* 
 */

/* 
BulkMailService.sendDifferentEmailToMultipleRecipientsWithTemplate( [
    {
        to: "soesitsocials@gmail.com",
        templateId: "d-fda47418ee0941f0838d11037bf5b283",
    dynamicTemplateData: {firstName:"Bulk Multi", lastName:"socials", code:"Block"}
    },

    {
        to: "ejecsofficial@gmail.com",
        templateId: "d-fda47418ee0941f0838d11037bf5b283",
    dynamicTemplateData: {firstName:"Bulk Multi", lastName:"socials", code:"Block"}
    },

    {
        to: "soesitintellect@gmail.com",
        templateId: "d-fda47418ee0941f0838d11037bf5b283",
    dynamicTemplateData: {firstName:"Bulk Multi ", lastName:"socials", code:"Block"}
    }



] )

.then((res: any) => {
    console.log({res, from: "then"});
})
.catch((err: any) => {
    console.log({err , from: "catch"});
})


 */

// test the above class
/* 


mailService.sendSingleEmailToMultipleWithTemplate( [{
    
    email:"soesitsocials@gmail.com",
    name: "soe sit"

},
{  email:"youngprince042@gmail.com" },
{  email:"mypitransact@gmail.com" , name: "mypitransact"},
{  email:"devchisomaga@gmail.com" , name: "devchisomaga"},

], "d-fda47418ee0941f0838d11037bf5b283", {firstName:"General", lastName:"Kenobi", code:"123456"})
.then((res: any) => {
    console.log({res, from: "then"});
})
.catch((err: any) => {
    console.log({err , from: "catch"});
}) 

*/
/* 
mailService.sendDifferentEmailToMultipleRecipientsWithTemplate([
    {
to:"soesitsocials@gmail.com",
templateId:"d-fda47418ee0941f0838d11037bf5b283",
dynamicTemplateData:{firstName:"SOE", lastName:"Social", code:"S123456"}

},
{ 
templateId:"d-fda47418ee0941f0838d11037bf5b283",
dynamicTemplateData:{firstName:"Pi", lastName:"Transact", code:"P123456"},

    to:"mypitransact@gmail.com"
    
    },

    {
       
templateId:"d-fda47418ee0941f0838d11037bf5b283",
dynamicTemplateData:{firstName:"Dev", lastName:"Chisomaga", code:"D123456"},

        to:"devchisomaga@gmail.com"
        
        },
]
    )
    
    .then((res: any) => {
        console.log({res, from: "then"});
    })

    .catch((err: any) => {
        console.log({err , from: "catch"});

    })
 */
