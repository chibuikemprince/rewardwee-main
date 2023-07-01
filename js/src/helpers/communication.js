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
/*
let enteries: EventEntries[] = [


{
    detailType: "EMAIL-Test",
    source: "email.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "EMAIL",
        action: "TEST",
        data: {
            to: "soesitsocials@gmail.com",
            subject: "EMAIl Microservice Test 3",
            body: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns."

        }
    }
},

{
    detailType: "EMAIL",
    source: "email.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "EMAIL",
        action: "EMAIL",
        data: {
            to: "soesitsocials@gmail.com",
            subject: "EMAIl Microservice 3",
            body: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns."

        }
    }
},

{
    detailType: "EMAIL-Tests",
    source: "email.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "EMAIL",
        action: "EMAIL_TEST",
        data: {
            to: "soesitsocials@gmail.com",
            subject: "EMAIl Microservice second 3",
            body: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns."

        }
    }
}


]


new EventBridge().sendEvent(enteries
)
.then((response: any) => {
    console.log({Fres: JSON.stringify(response), message: "event sent successfully."});
}
)
.catch((err: any) => {
console.log({err, message: "event not sent, please try again."});
})
 */
