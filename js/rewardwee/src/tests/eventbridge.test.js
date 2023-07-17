"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// send enent to event bridge
const globals_1 = require("@jest/globals");
const communication_1 = require("../helpers/communication");
(0, globals_1.describe)("EventBridge", () => {
    (0, globals_1.describe)("SendSingleEmailEvent", () => {
        it("should send an email to multiple recipients", () => __awaiter(void 0, void 0, void 0, function* () {
            let enteries = [
                {
                    detailType: "EMAIL-Test",
                    source: "email.rewardwee",
                    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
                    resources: [],
                    detail: {
                        type: "single",
                        action: "EMAIL",
                        data: {
                            to: "soesitsocials@gmail.com",
                            subject: "Single Email Test without template",
                            text: "This is a test email from RewardWee for single email without template",
                            html: "<h1>This is a test email from RewardWee for single email without template</h1>"
                        }
                    }
                }
            ];
            let response = yield new communication_1.EventBridge().sendEvent(enteries);
            (0, globals_1.expect)(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
            (0, globals_1.expect)(response.status).toBe(200);
        }));
    });
    (0, globals_1.describe)("SendSingleEmailEventToMultipleRecipientsWithoutTemplate", () => {
        it("should send an email to multiple recipients without template", () => __awaiter(void 0, void 0, void 0, function* () {
            let enteries = [
                {
                    detailType: "EMAIL",
                    source: "email.rewardwee",
                    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
                    resources: [],
                    detail: {
                        type: "bulk",
                        action: "EMAIL",
                        data: {
                            to: [
                                { email: "soesitsocials@gmail.com" },
                                { email: "ejecsofficial@gmail.com" },
                                { email: "soesitintellect@gmail.com" }
                            ],
                            subject: "SendSingleEmailEventToMultipleRecipientsWithoutTemplate",
                            text: " This is a test email from RewardWee for single email without template to multiple recipients",
                            html: "<h1>This is a test email from RewardWee for single email without template to multiple recipients</h1>"
                        }
                    }
                }
            ];
            let response = yield new communication_1.EventBridge().sendEvent(enteries);
            (0, globals_1.expect)(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
            (0, globals_1.expect)(response.status).toBe(200);
        }));
    });
    (0, globals_1.describe)("BulkMultipleEmailToMultipleRecipientWithoutTemplate", () => {
        it("should send multiple email to multiple recipients", () => __awaiter(void 0, void 0, void 0, function* () {
            let enteries = [
                {
                    detailType: "SMS-Test",
                    source: "sms.rewardwee",
                    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
                    resources: [],
                    detail: {
                        type: "bulk-multiple",
                        action: "EMAIL",
                        data: { differentEmails: [
                                {
                                    to: "soesitsocials@gmail.com",
                                    subject: " Multiple Email Test without template to multiple recipients",
                                    text: "This is a test email from RewardWee for multiple email without template to multiple recipients",
                                    html: "<h1>This is a test email from RewardWee for multiple email without template to multiple recipients</h1>"
                                },
                                {
                                    to: " ejecsofficial@gmail.com",
                                    subject: " Multiple Email Test without template to multiple recipients",
                                    text: "This is a test email from RewardWee for multiple email without template to multiple recipients",
                                    html: "<h1>This is a test email from RewardWee for multiple email without template to multiple recipients</h1>"
                                },
                                {
                                    to: "soesitintellect@gmail.com",
                                    subject: " Multiple Email Test without template to multiple recipients",
                                    text: "This is a test email from RewardWee for multiple email without template to multiple recipients",
                                    html: "<h1>This is a test email from RewardWee for multiple email without template to multiple recipients</h1>"
                                }
                            ] }
                    }
                }
            ];
            let response = yield new communication_1.EventBridge().sendEvent(enteries);
            (0, globals_1.expect)(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
            (0, globals_1.expect)(response.status).toBe(200);
        }));
    });
    (0, globals_1.describe)("BulkSingleEmailToMultipleRecipientWithTemplate", () => {
        let enteries = [
            {
                detailType: "EMAIL-Tests",
                source: "email.rewardwee",
                eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
                resources: [],
                detail: {
                    type: "bulk-template",
                    action: "EMAIL",
                    data: {
                        to: [
                            { email: "soesitsocials@gmail.com" },
                            { email: "ejecsofficial@gmail.com" },
                            { email: "soesitintellect@gmail.com" }
                        ],
                        templateId: "d-fda47418ee0941f0838d11037bf5b283",
                        dynamicTemplateData: { firstName: "EventBridge- BulkSingleEmailToMultipleRecipient", lastName: "Test", code: "1111" }
                    }
                }
            }
        ];
        it("should send a single email to multiple recipients with template", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield new communication_1.EventBridge().sendEvent(enteries);
            (0, globals_1.expect)(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
            (0, globals_1.expect)(response.status).toBe(200);
        }));
    });
    (0, globals_1.describe)("BulkSingleEmailToSingleRecipientWithTemplate", () => {
        let enteries = [
            {
                detailType: "EMAIL-Tests",
                source: "email.rewardwee",
                eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
                resources: [],
                detail: {
                    type: "single-template",
                    action: "EMAIL",
                    data: {
                        to: "soesitsocials@gmail.com",
                        templateId: "d-fda47418ee0941f0838d11037bf5b283",
                        dynamicTemplateData: { firstName: "EventBridge - BulkSingleEmailToSingleRecipientWithTemplate", lastName: "Test", code: "1111" }
                    }
                }
            }
        ];
        it("should send a single email to single recipient with template", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield new communication_1.EventBridge().sendEvent(enteries);
            (0, globals_1.expect)(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
            (0, globals_1.expect)(response.status).toBe(200);
        }));
    });
    (0, globals_1.describe)("BulkMultipleEmailToMultipleRecipientWithTemplate", () => {
        it("should send multiple email to multiple recipients with template", () => __awaiter(void 0, void 0, void 0, function* () {
            let enteries = [
                {
                    detailType: "SMS-Test",
                    source: "sms.rewardwee",
                    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
                    resources: [],
                    detail: {
                        type: "bulk-multiple-template",
                        action: "EMAIL",
                        data: { differentEmailTemplates: [
                                {
                                    to: "soesitsocials@gmail.com",
                                    templateId: "d-fda47418ee0941f0838d11037bf5b283",
                                    dynamicTemplateData: { firstName: "BulkMultipleEmailToMultipleRecipientWithTemplate", lastName: "Test", code: "EventBridge" }
                                },
                                {
                                    to: "ejecsofficial@gmail.com",
                                    templateId: "d-fda47418ee0941f0838d11037bf5b283",
                                    dynamicTemplateData: { firstName: "BulkMultipleEmailToMultipleRecipientWithTemplate", lastName: "Test", code: "EventBridge" }
                                },
                                {
                                    to: "soesitintellect@gmail.com",
                                    templateId: "d-fda47418ee0941f0838d11037bf5b283",
                                    dynamicTemplateData: { firstName: "BulkMultipleEmailToMultipleRecipientWithTemplate", lastName: "Test", code: "EventBridge" }
                                }
                            ] }
                    }
                }
            ];
            let response = yield new communication_1.EventBridge().sendEvent(enteries);
            (0, globals_1.expect)(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
            (0, globals_1.expect)(response.status).toBe(200);
        }));
    });
});
