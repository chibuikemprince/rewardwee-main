"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const modules_1 = require("../modules");
const customTypes_1 = require("./customTypes");
const getEnv_1 = require("./getEnv");
const communication_1 = require("../helpers/communication");
const sendEmail = (data) => {
    return new Promise((resolve, reject) => {
        let { receiver, message, template, subject, type, detailType } = data;
        if (customTypes_1.EMAIL_TEMPLATES.hasOwnProperty(template) === false) {
            let error = {
                data: [],
                message: "email template not found.",
                status: 404,
                statusCode: "RESOURCE_NOT_FOUND"
            };
            reject(error);
            return;
        }
        else {
            let templateId = customTypes_1.EMAIL_TEMPLATES[template];
            // make event bridg call for single-template
            let from = (0, getEnv_1.getEnv)("SENDER_EMAIL");
            const msg = {
                to: receiver,
                from,
                templateId,
                dynamicTemplateData: data.data != undefined ? data.data : {}
            };
            let enteries = [
                {
                    detailType,
                    source: "email.rewardwee",
                    eventBusName: (0, modules_1.getGlobalEnv)("EMAIL_EVENTBUS_NAME"),
                    resources: [],
                    detail: {
                        type,
                        action: "EMAIL",
                        data: msg
                    }
                }
            ];
            new communication_1.EventBridge().sendEvent(enteries)
                .then((response) => {
                resolve(response);
                return;
            })
                .catch((err) => {
                reject(err);
                return;
            });
        }
    });
};
exports.sendEmail = sendEmail;
