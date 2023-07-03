
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
                //console.log({err})
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
  