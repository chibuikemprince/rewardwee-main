/*

import { RESPONSE_TYPE } from "./customTypes";

 
      const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");


interface EventDetail {
  [key: string]: any;
}

interface myEvent {
  Source: string;
  DetailType: string;
  Detail: EventDetail;
  EventBusName: string;
   Resources: string[];
}

const eventBridgeClient = new EventBridgeClient({ region: "us-east-1" });

const sendEvent1 = async (events: myEvent[] ): Promise<any> => {
  const params: any = {
    Entries: events.map((event) => ({
      Source: event.Source,
      DetailType: event.DetailType,
      Detail: JSON.stringify(event.Detail),
      EventBusName: event.EventBusName, // optional
      Resources: event.Resources,
      Time: new Date()





    }))
  };
  try {
    const command = new PutEventsCommand(params);
    const response = await eventBridgeClient.send(command);
    return response;
  } catch (err) {
    console.log('Error sending events:', err);
    return null;
  }
};

// recreate sendEvent function to return Promise<RESPONSE_TYPE>

const sendEvent = async (events: myEvent[] ): Promise<RESPONSE_TYPE> => {

return new Promise((resolve, reject) => {

  const params: any = {

    Entries: events.map((event) => ({
      Source: event.Source,
      DetailType: event.DetailType,
      Detail: JSON.stringify(event.Detail),
      EventBusName: event.EventBusName, // optional
      Resources: event.Resources,
      Time: new Date()
    }))
  };
  try {

    const command = new PutEventsCommand(params);
 eventBridgeClient.send(command)
    .then((response: any) => {
      let data: RESPONSE_TYPE = {
        data: response,
        message: "event sent successfully.",
        status: 200,
        statusCode: "SUCCESS"
        }
        resolve(data);
        return null;
    })
    .catch((err: any) => {
      console.log('Error sending events:', err);
      let error: RESPONSE_TYPE = {
        data: [],

        message: "event not sent, please try again.",
        status: 500,
        statusCode: "FORM_REQUIREMENT_ERROR"
        }
        reject(error);
        return null;

    })

  } catch (err) {
    console.log('Error sending events:', err);
    let error: RESPONSE_TYPE = {
      data: [],
      message: "event not sent, please try again.",
      status: 500,
      statusCode: "FORM_REQUIREMENT_ERROR"
     }
     
      reject(error);
      return null;


  }

})

}
const events: myEvent[] = [
    {
      Source: 'myapp.somecomponent',
      DetailType: 'UserCreated',
      Detail: {
        userId: '1234567890',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        },
        Resources: [],
        EventBusName: "default", // optional

    },


  ];
  
 sendEvent(events)
  .then((response) => {
  console.log({Fres: JSON.stringify(response), message: "event sent successfully."});
    })
    .catch((err) => {
        console.log({err, message: "event not sent, please try again."});
    });


  */

 import Aws from 'aws-sdk';
import { RESPONSE_TYPE } from './customTypes';

//A class that has two functions 
//1. send messages via aws eventbrigde
//2. receive messages via aws eventbrigde
// each method in the class should return Promise<RESPONSE_TYPE>
// Path: src\helpers\eventBridge.ts

class EventBridgeClass {

    private eventBridge: Aws.EventBridge;
    private eventBusName: string;

    constructor() {
        this.eventBridge = new Aws.EventBridge();
        this.eventBusName = process.env.EVENT_BUS_NAME as string;
        console.log(this.eventBridge)
    }

    async sendEvent(detailType: string, source: string, detail: any, resources: string[]= []): Promise<RESPONSE_TYPE> {
        return new Promise((resolve: any, reject: any) => {
            let params = {
                Entries: [
                    {
                        Detail: JSON.stringify(detail),
                        DetailType: detailType,
                        EventBusName: this.eventBusName,
                        Resources: resources,
                        Source: source,
                        Time: new Date()
                    }
                ]
            }
            this.eventBridge.putEvents(params, (err: any, data: any) => {
                if (err) {
                    let error: RESPONSE_TYPE = {
                        data: [],
                        message: "event not sent, please try again.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    }
                    reject(error);
                    return;
                }
                else {
                    let done: RESPONSE_TYPE = {
                        data: [],
                        message: "event sent successfully.",
                        status: 200,
                        statusCode: "SUCCESS"
                    }
                    resolve(done);
                    return;
                }
            });
        });
    }
 
/*  

    async receiveEvent(): Promise<RESPONSE_TYPE> {
        return new Promise((resolve: any, reject: any) => {
            let params = {
                EventBusName: this.eventBusName
            }
            this.eventBridge.listEventBuses(params, (err: any, data: any) => {
                if (err) {
                    let error: RESPONSE_TYPE = {
                        data: [],
                        message: "event not received, please try again.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    }
                    reject(error);
                    return;
                }
                else {
                    let done: RESPONSE_TYPE = {
                        data: data,
                        message: "event received successfully.",
                        status: 200,
                        statusCode: "SUCCESS"
                    }
                    resolve(done);
                    return;
                }
            });
        });
    }
     */


}

new EventBridgeClass().sendEvent("gift", "prince-app", {name:"Prince Chisomaga", time: Date.now()}, []).then((res: any) => {
    console.log({res, message: "event sent successfully."})
}).catch((err: any) => {
    console.log({err, message: "event not sent, please try again."})
})


export const EventBridge = EventBridgeClass; 