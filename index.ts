//import sendgrid email library

import dotenv from "dotenv";

dotenv.config();

import { BulkMailService, SingleMailService  } from "./src/controllers";
import { ErrorDataType, LogError } from "./src/helpers/errorReporting";

export const handler = async (event: any, context: any) => {

let {to, subject, text, html, templateId, dynamicTemplateData, differentEmails, differentEmailTemplates} = event.detail.data;
console.log({detail: event.detail, function:"EMAIL"})
let type = event.detail.type;
let feedback:any;
let error_log: ErrorDataType;
switch (type) {

    case "single":
        try {
            feedback = await SingleMailService.sendEmail(to, subject, text, html)
            console.log({feedback, action: "single without template success"})
             
        }
        catch (err: any) {

            error_log =  {
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }

            LogError(error_log);
            console.log({err, action: "single without template error"})
             
        }
        break;
      

    case "bulk":

        try {
            
            feedback = await BulkMailService.sendSingleEmailToMultiple(to, subject, text, html)
            console.log({feedback, action: "bulk without template success"})
             
        }
        catch (err: any) {

            error_log =  {
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }

            LogError(error_log);
            console.log({err, action: "bulk without template error"})
             
        }

        break;


    case "single-template":

        
       try {

        
       feedback = await SingleMailService.sendEmailWithTemplate(to, templateId, dynamicTemplateData)
         console.log({feedback, action: "single with template success"})


    
    }
    catch (err: any) {

        error_log =  {
            msg: ` error from sendEmail, Error: ${err.message}`,
            status: "STRONG",
            time: new Date().toUTCString(),
            stack: err.stack
        }

        LogError(error_log);
        console.log({err, action: "single with template error"})

    }
        break;



    case "bulk-template":

    try {

        
        feedback = await BulkMailService.sendSingleEmailToMultipleWithTemplate(to, templateId, dynamicTemplateData)
            console.log({feedback, action: "bulk with template success"}) 
 
 
     
     } 
        
        catch (err: any) {

            error_log =  {
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }

            LogError(error_log);

            console.log({err, action: "bulk with template error"})

        }
        break;


        
    case "bulk-multiple-template":
        try{
                
        feedback = await BulkMailService.sendDifferentEmailToMultipleRecipientsWithTemplate ( differentEmailTemplates)
        console.log({feedback, action: "bulk multiple with template success"})


        }
        catch (err: any) {
 
            error_log =  {
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }

            LogError(error_log);

            console.log({err, action: "bulk multiple with template error"})

        }

        break;






       
  

    case "bulk-multiple":
        try{

        feedback = await BulkMailService.sendDifferentEmailToMultipleRecipients ( differentEmails)
        console.log({feedback, action: "bulk multiple without template success"})

        }
        catch (err: any) {

            error_log =  {
                msg: ` error from sendEmail, Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack
            }

            LogError(error_log);

            console.log({err, action: "bulk multiple without template error"})

        }

        break;

    default:
        console.log({action: "default"});
        break;









}

}

/* 
handler({detail: {type: "single", 

data: {
    to: "soesitsocials@gmail.com",
    subject: "test",
    text: "test",
    html: "test"

}
}}, {} )
.then((res: any) => {
    console.log({res, action: "single without template success"})
    return res;
}
)
.catch((err: any) => {
    console.log({err, action: "single without template error"})
    return err;
}
);

 */




