import { Types } from "mongoose";
import { EMAIL_TEMPLATES } from "./mail";

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
  
  

 

export type EMAIL_TEMPLATES_TYPES =  keyof typeof EMAIL_TEMPLATES;
 
export type EmailData = {
receiver: string;
message: string;
template: EMAIL_TEMPLATES_TYPES;
subject: string

}
 

export type RegData = {

email: string;
password: string;
company: string;
first_name: string;
last_name: string;
  
}



export interface TokenPayload {
  email: string;
  id: string;
  time: number;
}


  export type STATUSCODE = keyof typeof STATUSCODE_ENUM;
   