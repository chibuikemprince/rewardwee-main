import { getGlobalEnv } from "../modules";
import { EMAIL_TEMPLATES, EmailData, RESPONSE_TYPE } from "./customTypes"
import { getEnv } from "./getEnv";

import { EventBridge } from "../helpers/communication";
import { EventEntries } from "../helpers/customTypes";

  
   export const sendEmail = (data: EmailData): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {
  let { receiver, message, template, subject, type, detailType} = data;
if(EMAIL_TEMPLATES.hasOwnProperty(template) === false){

    let error: RESPONSE_TYPE = {
        data: [],
        message: "email template not found.",
        status: 404,
        statusCode: "RESOURCE_NOT_FOUND"
    }
    reject(error);
    return;
}

  else{
    let templateId = EMAIL_TEMPLATES[template];
  // make event bridg call for single-template

  let from = getEnv("SENDER_EMAIL") as string;
  const msg = {
      to: receiver,
      from,
      templateId,
      dynamicTemplateData: data.data != undefined ? data.data : { }

    };



    let enteries: EventEntries[] = [
      {
          detailType,
          source: "email.rewardwee",
          eventBusName:  getGlobalEnv("EMAIL_EVENTBUS_NAME") as string,
          resources:[],
          detail: {
              type,
              action: "EMAIL",
              data: msg
          }
      }
      

    ]

      new EventBridge().sendEvent(enteries)
    .then((response: RESPONSE_TYPE)=>{
      resolve(response);
      return;

    })
    .catch((err: any)=>{
      reject(err);
      return;
    })



  }   
    })



  }
