"use strict";
//import sendgrid email library
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const controllers_1 = require("./src/controllers");
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    //to: string, subject: string, text: string, html?: string
    console.log({ event, context, function: "EMAIL" });
    let { to, subject, text, html, templateId, dynamicTemplateData, differentEmails, differentEmailTemplates } = event.detail.data;
    let type = event.detail.type;
    switch (type) {
        case "single":
            controllers_1.SingleMailService.sendEmail(to, subject, text, html)
                .then((res) => {
                console.log({ res, action: "single without template success" });
                return res;
            })
                .catch((err) => {
                console.log({ err, action: "single without template error" });
                return err;
            });
            break;
        case "bulk":
            controllers_1.BulkMailService.sendSingleEmailToMultiple(to, subject, text, html)
                .then((res) => {
                console.log({ res, action: "bulk without template success" });
                return res;
            })
                .catch((err) => {
                console.log({ err, action: "bulk without template error" });
                return err;
            });
            break;
        case "single-template":
            controllers_1.SingleMailService.sendEmailWithTemplate(to, templateId, dynamicTemplateData)
                .then((res) => {
                console.log({ res, action: "single with template success" });
                return res;
            })
                .catch((err) => {
                console.log({ err, action: "single with template error" });
                return err;
            });
            break;
        case "bulk-template":
            controllers_1.BulkMailService.sendSingleEmailToMultipleWithTemplate(to, templateId, dynamicTemplateData)
                .then((res) => {
                console.log({ res, action: "bulk with template success" });
                return res;
            })
                .catch((err) => {
                console.log({ err, action: "bulk with template error" });
                return err;
            });
            break;
        case "bulk-multiple-template":
            controllers_1.BulkMailService.sendDifferentEmailToMultipleRecipientsWithTemplate(differentEmailTemplates)
                .then((res) => {
                console.log({ res, action: "bulk multiple with template success" });
                return res;
            })
                .catch((err) => {
                console.log({ err, action: "bulk multiple with template error" });
                return err;
            });
            break;
        case "bulk-multiple":
            controllers_1.BulkMailService.sendDifferentEmailToMultipleRecipients(differentEmails)
                .then((res) => {
                console.log({ res, action: "bulk multiple without template success" });
                return res;
            })
                .catch((err) => {
                console.log({ err, action: "bulk multiple without template error" });
                return err;
            });
            break;
        default:
            break;
    }
});
exports.handler = handler;
