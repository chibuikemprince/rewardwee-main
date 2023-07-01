"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleMailService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const getEnv_1 = require("../../helpers/getEnv");
const errorReporting_1 = require("../../helpers/errorReporting");
/*

import {MailService} from '@sendgrid/mail'

*/
const SendGridApiKey = (0, getEnv_1.getEnv)("SENDGRID_API_KEY");
console.log({ SendGridApiKey });
class MailService {
    constructor(apiKey) {
        mail_1.default.setApiKey(apiKey);
    }
    sendEmail(to, subject, text, html) {
        return new Promise((resolve, reject) => {
            let from = (0, getEnv_1.getEnv)("SENDER_EMAIL");
            const msg = {
                to,
                from,
                subject,
                text,
                html
            };
            mail_1.default.send(msg)
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
    //SENDGRID_MULTIPLE_EMAIL_DATA
    sendEmailWithTemplate(to, templateId, dynamicTemplateData) {
        return new Promise((resolve, reject) => {
            let from = (0, getEnv_1.getEnv)("SENDER_EMAIL");
            const msg = {
                to,
                from: (0, getEnv_1.getEnv)("SENDER_EMAIL"),
                templateId,
                dynamicTemplateData,
            };
            mail_1.default.send(msg)
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
exports.SingleMailService = new MailService(SendGridApiKey);
/*
mailService.sendEmailWithTemplate("soesitsocials@gmail.com", "d-fda47418ee0941f0838d11037bf5b283", {firstName:"soe", lastName:"socials", code:"123456"})
    .then((res: any) => {
        console.log({ res, done:"done"});
    })
    .catch((err: any) => {
        console.log({err, done:"done with error"});
    })

 */
