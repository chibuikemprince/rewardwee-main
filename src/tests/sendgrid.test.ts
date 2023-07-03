
import {describe, expect, test} from '@jest/globals';
import { BulkMailService, SingleMailService } from "../controllers/sendgrid";
import { RESPONSE_TYPE } from "../helpers/customTypes";

describe("Sendgrid BulkMailService", () => {



  //sendEmail - send email to single recipient

  describe("sendEmail", () => {
    it("should send an email to a single recipient", async () => {
      const response: RESPONSE_TYPE = await SingleMailService.sendEmail(  "soesitsocials@gmail.com", 
      "sendEmail Single Email - No Template",
       "This email was sent to you without template Test", "<p>This email was sent to you without template Test</p>")
      expect(response.statusCode).toBe("SUCCESS");
      expect(response.status).toBe(200);
    });
  });

  //sendEmailWithTemplate - send email to single recipient with template

  describe("sendEmailWithTemplate", () => {
    it("should send an email to a single recipient with template", async () => {
      const response: RESPONSE_TYPE = await SingleMailService.sendEmailWithTemplate("soesitsocials@gmail.com", "d-fda47418ee0941f0838d11037bf5b283", {firstName:"Send Single Email with Template", lastName:"Test", code:"123456"})

      expect(response.statusCode).toBe("SUCCESS");
      expect(response.status).toBe(200);
    });
  });


        
  describe("sendSingleEmailToMultiple", () => {


    it("should send an email to multiple recipients", async () => {
      const recipients = [
                   {email: "soesitsocials@gmail.com"},
                    {email: "ejecsofficial@gmail.com"},
                    {email: "soesitintellect@gmail.com"}
    
    ];
      const response: RESPONSE_TYPE = await BulkMailService.sendSingleEmailToMultiple(
        recipients,
        "sendSingleEmailToMultiple",
        "sendSingleEmailToMultiple",
        "<p>sendSingleEmailToMultiple</p>"
      );
 
      expect(response.statusCode).toBe("SUCCESS");
      expect(response.status).toBe(200);
    });
  });



 
  describe("sendDifferentEmailToMultipleRecipients", () => {
    it("should send different emails to multiple recipients", async () => {
      const emails = [
        {
          to: "soesitsocials@gmail.com",
          subject: "sendDifferentEmailToMultipleRecipients",
          text: "sendDifferentEmailToMultipleRecipients",
          html: "<p>sendDifferentEmailToMultipleRecipients</p>",
        },
        {
          to: "soesitintellect@gmail.com",
          subject: "sendDifferentEmailToMultipleRecipients",
          text: "sendDifferentEmailToMultipleRecipients",
          html: "<p>sendDifferentEmailToMultipleRecipients</p>",
        },
      ];
      const response: RESPONSE_TYPE = await BulkMailService.sendDifferentEmailToMultipleRecipients(
        emails
      );
      expect(response.statusCode).toBe("SUCCESS");
      expect(response.status).toBe(200);
    });
  });
 

  describe("sendSingleEmailToMultipleWithTemplate", () => {
const recipients = [
    {email: "soesitsocials@gmail.com"},
                {email: "ejecsofficial@gmail.com"},
                {email: "soesitintellect@gmail.com"}

]
const tempId =   "d-fda47418ee0941f0838d11037bf5b283";

const dynamicTemplateData =  {firstName:"sendSingleEmailToMultipleWithTemplate", lastName:"Test", code:"1111111111"}

    it("should send an email to multiple recipients with template", async () => {
      const response: RESPONSE_TYPE = await BulkMailService.sendSingleEmailToMultipleWithTemplate(
        recipients,
        tempId,
        dynamicTemplateData
      );
      expect(response.statusCode).toBe("SUCCESS");
      expect(response.status).toBe(200);
    }
    );

  });


  describe("sendDifferentEmailToMultipleRecipientsWithTemplate", () => {

     const emails = [
      {
          to: "soesitsocials@gmail.com",
          templateId: "d-fda47418ee0941f0838d11037bf5b283",
      dynamicTemplateData: {firstName:"sendDifferentEmailToMultipleRecipientsWithTemplate", lastName:"Test", code:"Block"}
      },
  
      {
          to: "ejecsofficial@gmail.com",
          templateId: "d-fda47418ee0941f0838d11037bf5b283",
          dynamicTemplateData: {firstName:"sendDifferentEmailToMultipleRecipientsWithTemplate", lastName:"Test", code:"Block"}
        },
  
      {
          to: "soesitintellect@gmail.com",
          templateId: "d-fda47418ee0941f0838d11037bf5b283",
          dynamicTemplateData: {firstName:"sendDifferentEmailToMultipleRecipientsWithTemplate", lastName:"Test", code:"Block"}
  }
  
  
  
  ];

    it("should send different emails to multiple recipients with template", async () => {
      const response: RESPONSE_TYPE = await BulkMailService.sendDifferentEmailToMultipleRecipientsWithTemplate(
        emails
      );
console.log({response})

      //expect(response.statusCode).toBe("SUCCESS");
      //expect(response.status).toBe(200);
    }
    );


  })


  

});
