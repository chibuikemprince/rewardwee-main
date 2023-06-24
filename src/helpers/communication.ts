
//A class that has two functions 
//1. send messages via aws eventbrigde
//2. receive messages via aws eventbrigde
// each method in the class should return Promise<RESPONSE_TYPE>
// Path: src\helpers\eventBridge.ts
// use  use AWS SDK for JavaScript (v3)

import { EventBridgeClient, PutEventsCommand } from   "@aws-sdk/client-eventbridge";
import { EventEntries, RESPONSE_TYPE } from "./customTypes";

export class EventBridge {

    private eventBridge: EventBridgeClient;

    constructor() {
        this.eventBridge = new EventBridgeClient({});
        
    }


    
//detailType: string, source: string, eventBusName: string, detail: any, resources: string[]= []
    async sendEvent(entries: EventEntries[]): Promise<RESPONSE_TYPE> {
        return new Promise((resolve: any, reject: any) => {
            let params = {

                Entries: entries.map((entry: EventEntries) => {
                    return {
                        Detail: JSON.stringify(entry.detail),
                        DetailType: entry.detailType,
                        EventBusName: entry.eventBusName,
                        Resources: entry.resources,
                        Source: entry.source,
                        Time: new Date()
                    }
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
            }


            this.eventBridge.send(new PutEventsCommand(params))
            .then((data: any) => {
                let response: RESPONSE_TYPE = {
                    data: data,
                    message: "event sent successfully.",
                    status: 200,
                    statusCode: "EVENT_SENT_SUCCESSFULLY"
                }
                resolve(response);
                return;
            })
            .catch((err: any) => {
                let error: RESPONSE_TYPE = {
                    data: [],
                    message: "event not sent, please try again.",
                    status: 500,
                    statusCode: "EVENT_NOT_SENT"
                }
                reject(error);
                return;
            })
        })
    }
}

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
