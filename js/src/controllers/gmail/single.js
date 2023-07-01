"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailGmailSIngle = void 0;
const errorReporting_1 = require("../../helpers/errorReporting");
const getEnv_1 = require("../../helpers/getEnv");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "../../../.env"
});
const sendEmailGmailSIngle = (data) => {
    return new Promise((resolve, reject) => {
        const { receiver, message, template, subject } = data;
        console.log({
            user: (0, getEnv_1.getEnv)("GMAIL_SENDER_EMAIL"),
            pass: (0, getEnv_1.getEnv)("GMAIL_SENDER_PASSWORD")
        });
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: (0, getEnv_1.getEnv)("GMAIL_SENDER_EMAIL"),
                pass: (0, getEnv_1.getEnv)("GMAIL_SENDER_PASSWORD")
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            from: (0, getEnv_1.getEnv)("GMAIL_SENDER_EMAIL"),
            to: receiver,
            subject: subject,
            html: message
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                let err = {
                    data: [],
                    message: "email not sent, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                reject(err);
                let error_log = {
                    msg: ` error from sendEmail, Error: ${error.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: error.stack
                };
                (0, errorReporting_1.LogError)(error_log);
                return;
            }
            else {
                console.log('Email sent: ' + info.response);
                let res = {
                    data: [],
                    message: "email sent successfully.",
                    status: 200,
                    statusCode: "SUCCESS"
                };
                resolve(res);
                return;
            }
        });
    });
};
exports.sendEmailGmailSIngle = sendEmailGmailSIngle;
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
