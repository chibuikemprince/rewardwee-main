import { Types } from "mongoose";
import { EMAIL_TEMPLATES } from "./templateId";

enum STATUSCODE_ENUM {
    UNKNOWN_ERROR,
    FORM_REQUIREMENT_ERROR,
    PAGE_NOT_FOUND, 
    RESOURCE_NOT_FOUND, 
    RESOURCE_ALREADY_EXIST,
    SUCCESS
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
 

  export type STATUSCODE = keyof typeof STATUSCODE_ENUM;
    