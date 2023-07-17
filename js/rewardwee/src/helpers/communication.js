"use strict";
//A class that has two functions 
//1. send messages via aws eventbrigde
//2. receive messages via aws eventbrigde
// each method in the class should return Promise<RESPONSE_TYPE>
// Path: src\helpers\eventBridge.ts
// use  use AWS SDK for JavaScript (v3)
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
exports.EventBridge = void 0;
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
class EventBridge {
    constructor() {
        this.eventBridge = new client_eventbridge_1.EventBridgeClient({});
    }
    //detailType: string, source: string, eventBusName: string, detail: any, resources: string[]= []
    sendEvent(entries) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let params = {
                    Entries: entries.map((entry) => {
                        return {
                            Detail: JSON.stringify(entry.detail),
                            DetailType: entry.detailType,
                            EventBusName: entry.eventBusName,
                            Resources: entry.resources,
                            Source: entry.source,
                            Time: new Date()
                        };
                    })
                    /* : [
                        {
                            Detail: JSON.stringify(detail),
                            DetailType: detailType,
                            EventBusName: eventBusName,
                            Resources: resources,
                            Source: source,
                            Time: new Date()
                        }
                    ] */
                };
                this.eventBridge.send(new client_eventbridge_1.PutEventsCommand(params))
                    .then((data) => {
                    let response = {
                        data: data,
                        message: "event sent successfully.",
                        status: 200,
                        statusCode: "EVENT_SENT_SUCCESSFULLY"
                    };
                    resolve(response);
                    return;
                })
                    .catch((err) => {
                    //console.log({err})
                    let error = {
                        data: [],
                        message: "event not sent, please try again.",
                        status: 500,
                        statusCode: "EVENT_NOT_SENT"
                    };
                    reject(error);
                    return;
                });
            });
        });
    }
}
exports.EventBridge = EventBridge;
