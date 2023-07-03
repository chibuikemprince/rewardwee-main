// send enent to event bridge
import {describe, expect, test} from '@jest/globals';
import { EventBridge } from "../helpers/communication";
import { EventEntries } from "../helpers/customTypes";


describe("EventBridge", () => {

describe("SendSingleEmailEvent",   () => {
    it("should send an email to multiple recipients", async () => {
       
let enteries: EventEntries[] = [
     

    {
        detailType: "EMAIL-Test",
        source: "email.rewardwee",
        eventBusName: "arn:aws:events:us-east-1:352600133761:event-bus/testing",
        resources:[],
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
    
    
]  

let response = await new EventBridge().sendEvent(enteries
    )

    expect(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
    expect(response.status).toBe(200);


    });
})

describe("SendSingleEmailEventToMultipleRecipientsWithoutTemplate",   () => {
    it("should send an email to multiple recipients without template", async () => {
let enteries: EventEntries[] = [
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
                subject: "SendSingleEmailEventToMultipleRecipientsWithoutTemplate",
                text: " This is a test email from RewardWee for single email without template to multiple recipients",
                html: "<h1>This is a test email from RewardWee for single email without template to multiple recipients</h1>"

            }
        }
    }
];

let response = await new EventBridge().sendEvent(enteries
    )

    expect(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
    expect(response.status).toBe(200);


    })

})


describe("BulkMultipleEmailToMultipleRecipientWithoutTemplate",   () => {
    it("should send multiple email to multiple recipients", async () => {

let enteries: EventEntries[] = [
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
    
            ]}
                 
    
    
    
    }
    
    }
        
]

let response = await new EventBridge().sendEvent(enteries 
    )

    expect(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
    expect(response.status).toBe(200);

})
 
})

describe("BulkSingleEmailToMultipleRecipientWithTemplate",   () => {

let enteries: EventEntries[] = [
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
                dynamicTemplateData: {firstName:"EventBridge- BulkSingleEmailToMultipleRecipient", lastName:"Test", code:"1111"}
    
            }
        }
    }
    
]
it("should send a single email to multiple recipients with template", async () => {

let response = await new EventBridge().sendEvent(enteries
    )

    expect(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
    expect(response.status).toBe(200);

})


})


describe("BulkSingleEmailToSingleRecipientWithTemplate",   () => {


    let enteries: EventEntries[] = [
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
                    dynamicTemplateData: {firstName:"EventBridge - BulkSingleEmailToSingleRecipientWithTemplate", lastName:"Test", code:"1111"}
                    
                }
            }
        }
        
        

    ]
    it("should send a single email to single recipient with template", async () => {

let response = await new EventBridge().sendEvent(enteries
    )

    expect(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
    expect(response.status).toBe(200);
    })


})


describe("BulkMultipleEmailToMultipleRecipientWithTemplate",   () => {


    it("should send multiple email to multiple recipients with template", async () => {
        let enteries: EventEntries[] = [
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
                        dynamicTemplateData: {firstName:"BulkMultipleEmailToMultipleRecipientWithTemplate", lastName:"Test", code:"EventBridge"}
                        },
            
                        {
                            to: "ejecsofficial@gmail.com",
                            templateId: "d-fda47418ee0941f0838d11037bf5b283",
                            dynamicTemplateData: {firstName:"BulkMultipleEmailToMultipleRecipientWithTemplate", lastName:"Test", code:"EventBridge"}

                        },
            
                        {
                            to: "soesitintellect@gmail.com",
                            templateId: "d-fda47418ee0941f0838d11037bf5b283",
                            dynamicTemplateData: {firstName:"BulkMultipleEmailToMultipleRecipientWithTemplate", lastName:"Test", code:"EventBridge"}

                        }
            
            
            
                    ] }
                }
            }
        ]

let response = await new EventBridge().sendEvent(enteries
    )

    expect(response.statusCode).toBe("EVENT_SENT_SUCCESSFULLY");
    expect(response.status).toBe(200);

    


    })

})


})