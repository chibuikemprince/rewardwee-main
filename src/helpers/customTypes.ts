import { Types } from "mongoose";
import { EMAIL_TEMPLATES } from "./templateId";

import {EmailData as SendGridEmailData} from '@sendgrid/helpers/classes/email-address'

enum STATUSCODE_ENUM {
    UNKNOWN_ERROR,
    FORM_REQUIREMENT_ERROR,
    PAGE_NOT_FOUND, 
    RESOURCE_NOT_FOUND, 
    RESOURCE_ALREADY_EXIST,
    SUCCESS,
    ORIGIN_NOT_ALLOWED,
    UNAUTHORIZED,
    FORBIDDEN,
    EVENT_SENT_SUCCESSFULLY,
    EVENT_NOT_SENT

  }
  
  export type RESPONSE_TYPE = {
    message: string;
    data: any[];
    statusCode: STATUSCODE;
    status: number;
  };
  
  

 export type EMAIL_TEMPLATES_TYPE = keyof typeof EMAIL_TEMPLATES;

export type EmailData = {
receiver: string;
message: string;
template: EMAIL_TEMPLATES_TYPE;
subject: string

}
 
export type SENDGRID_MULTIPLE_EMAIL_DATA = {

    to: string;
    from?: string; // your email here
    subject: string;
    text: string;
    html: string;

     
   

    
  };


  export type SENDGRID_MULTIPLE_EMAIL_DATA_WITH_TEMPLATE =  {
    to: string;
    from?:  string;
    templateId: string;
    dynamicTemplateData: any;
  }
  export type STATUSCODE = keyof typeof STATUSCODE_ENUM;
    

  export interface GeneralObject {
    [key: string]: any;
  }

  export interface EventDetail {
    type: string;
    action: string;
    data: GeneralObject;
  }

  export interface EventEntries {
    detail: EventDetail;
    detailType: string;
    eventBusName: string;
    resources: string[];
    source: string;
  }
