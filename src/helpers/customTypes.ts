import { Types } from "mongoose";

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
  
  

 
export type EmailData = {
receiver: string;
message: string;
template: string;
subject: string

}
 

 
  export type STATUSCODE = keyof typeof STATUSCODE_ENUM;
   