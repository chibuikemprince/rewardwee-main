"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkMailService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const getEnv_1 = require("../../helpers/getEnv");
const errorReporting_1 = require("../../helpers/errorReporting");
/* import dotenv from 'dotenv'
import { it } from "node:test";
dotenv.config({path:__dirname+'/./../../../.env'})
 */
const SendGridApiKey = (0, getEnv_1.getEnv)("SENDGRID_API_KEY");
class MailService {
    constructor(apiKey) {
        mail_1.default.setApiKey(apiKey);
    }
    sendSingleEmailToMultiple(to, subject, text, html) {
        return new Promise((resolve, reject) => {
            let from = (0, getEnv_1.getEnv)("SENDER_EMAIL");
            console.log({ from });
            const msg = {
                to,
                from,
                subject,
                text,
                html,
            };
            mail_1.default.sendMultiple(msg)
                .then((res) => {
                let done = {
                    data: [],
                    message: "email sent successfully.",
                    status: 200,
                    statusCode: "SUCCESS"
                };
                resolve(done);
                return;
            })
                .catch((err) => {
                let error_log = {
                    msg: ` error from sendEmail, Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack
                };
                (0, errorReporting_1.LogError)(error_log);
                let error = {
                    data: [],
                    message: "email not sent, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                reject(error);
                return;
            });
        });
    }
    sendSingleEmailToMultipleWithTemplate(to, templateId, dynamicTemplateData) {
        return new Promise((resolve, reject) => {
            let from = (0, getEnv_1.getEnv)("SENDER_EMAIL");
            const msg = {
                to,
                from,
                templateId,
                dynamicTemplateData,
            };
            mail_1.default.sendMultiple(msg)
                .then((res) => {
                let done = {
                    data: [],
                    message: "email sent successfully.",
                    status: 200,
                    statusCode: "SUCCESS"
                };
                resolve(done);
                return;
            })
                .catch((err) => {
                let error_log = {
                    msg: ` error from sendEmail, Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack
                };
                (0, errorReporting_1.LogError)(error_log);
                let error = {
                    data: [],
                    message: "email not sent, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                reject(error);
                return;
            });
        });
    }
    sendDifferentEmailToMultipleRecipients(msg) {
        return new Promise((resolve, reject) => {
            let from = (0, getEnv_1.getEnv)("SENDER_EMAIL");
            mail_1.default.send(msg.map((item) => { item.from = from; return item; }))
                .then((res) => {
                let done = {
                    data: [],
                    message: "email sent successfully.",
                    status: 200,
                    statusCode: "SUCCESS"
                };
                resolve(done);
                return;
            })
                .catch((err) => {
                let error_log = {
                    msg: ` error from sendEmail, Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack
                };
                (0, errorReporting_1.LogError)(error_log);
                let error = {
                    data: [],
                    message: "email not sent, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                reject(error);
                return;
            });
        });
    }
    sendDifferentEmailToMultipleRecipientsWithTemplate(msg) {
        return new Promise((resolve, reject) => {
            let from = (0, getEnv_1.getEnv)("SENDER_EMAIL");
            mail_1.default.send(msg.map((item) => { item.from = from; return item; }))
                .then((res) => {
                let done = {
                    data: [],
                    message: "email sent successfully.",
                    status: 200,
                    statusCode: "SUCCESS"
                };
                resolve(done);
                return;
            })
                .catch((err) => {
                let error_log = {
                    msg: ` error from sendEmail, Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack
                };
                (0, errorReporting_1.LogError)(error_log);
                let error = {
                    data: [],
                    message: "email not sent, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                reject(error);
                return;
            });
        });
    }
}
exports.BulkMailService = new MailService(SendGridApiKey);
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
