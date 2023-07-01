
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

 
console.log({
    
    function: "EMAIL"
})
let enteries: EventEntries[] = [


/* {
    detailType: "EMAIL-Test",
    source: "email.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "single",
        action: "EMAIL",
        data: {
            to: "soesitsocials@gmail.com", 
            subject: "EMAIl Microservice Test 3",
            text: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.",
            html: "<h1>Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>"
 
        }
    }
},

{
    detailType: "EMAIL",
    source: "email.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "bulk",
        action: "EMAIL",
        data: {
            to: [
                {email: "soesitsocials@gmail.com"},
                {email: "ejecsofficial@gmail.com"},
                {email: "soesitintellect@gmail.com"}

            ], 
            subject: "EMAIl Microservice type bulk without template",
            text: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.",
            html: "<h1>Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>"

        }
    }
},

{
    detailType: "EMAIL-Tests",
    source: "email.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "single-template",
        action: "EMAIL",
        data: {
            to: "soesitsocials@gmail.com", 
            templateId: "d-fda47418ee0941f0838d11037bf5b283",
            dynamicTemplateData: {firstName:"single", lastName:"template", code:"5555555"}
            
        }
    }
},

{
    detailType: "EMAIL-Tests",
    source: "email.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "bulk-template",
        action: "EMAIL",
        data: {
           to: [
                {email: "soesitsocials@gmail.com"},
                {email: "ejecsofficial@gmail.com"},
                {email: "soesitintellect@gmail.com"}
                
            ],
            templateId: "d-fda47418ee0941f0838d11037bf5b283",
            dynamicTemplateData: {firstName:"Bulk", lastName:"Template", code:"5555555"}

        }
    }
},

{
    detailType: "SMS-Test",
    source: "sms.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "bulk-multiple-template",
        action: "EMAIL",
        data: {differentEmailTemplates:[
            {
                to: "soesitsocials@gmail.com",
                templateId: "d-fda47418ee0941f0838d11037bf5b283",
            dynamicTemplateData: {firstName:"Multiple", lastName:"Template", code:"Block"}
            },

            {
                to: "ejecsofficial@gmail.com",
                templateId: "d-fda47418ee0941f0838d11037bf5b283",
                dynamicTemplateData: {firstName:"Multiple", lastName:"Template", code:"Block"}

            },

            {
                to: "soesitintellect@gmail.com",
                templateId: "d-fda47418ee0941f0838d11037bf5b283",
                dynamicTemplateData: {firstName:"Multiple", lastName:"Template", code:"Block"}

            }



        ] }
    }
},
 */
  
{
    detailType: "SMS-Test",
    source: "sms.rewardwee",
    eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
    resources:[],
    detail: {
        type: "bulk-multiple",
        action: "EMAIL",
        data: { differentEmails: [ 
            {
                to: "soesitsocials@gmail.com", 
                subject: "EMAIl Microservice bULK mULTIPLE Test 3",
                text: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.",
                html: "<h1>Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>"
     
            },

            {
                to: " ejecsofficial@gmail.com", 
                subject: "EMAIl Microservice bULK mULTIPLE Test 3",
                text: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.",
                html: "<h1>Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>"
     
            },
            {
                to: "soesitintellect@gmail.com", 
                subject: "EMAIl Microservice bULK mULTIPLE Test 3",
                text: "Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.",
                html: "<h1>Thank you so much for using our service. We hope you enjoy it. Please let us know if you have any questions or concerns.</h1>"
     
            }

        ]}
             



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
 
