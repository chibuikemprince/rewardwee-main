import { ObjectId, Types } from "mongoose"; 
import { getGlobalEnv,  getAllGlobalEnv  } from "../modules/globalEnv";
import {Request} from "express"
import { getEnv } from "./getEnv";
import { CurrencyType } from "../modules/types";

console.log({ getGlobalEnv,  getAllGlobalEnv  })
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
    EVENT_NOT_SENT,
    USER_NOT_FOUND,
    LOGIN_SUCCESSFUL,
    LOGOUT_SUCCESSFUL,
    LOGIN_FAILED,
    PLANS_NOT_FOUND,
    PLANS_FOUND,
    PLAN_CREATED,
    INCORRECT_PASSWORD,
    PLAN_NAME_EXISTS,
    ALREADY_EXISTS,
    STRIPE_ERROR,
    PAYMENT_UNSUCCESSFUL,
    CUSTOMER_CREATED,
    CUSTOMER_UPDATED
  }
  
  export type RESPONSE_TYPE = {
    message: string;
    data: any[];
    statusCode: STATUSCODE;
    status: number;
  };
  
  
export interface MyHttpRequest extends Request {

  user_id?: ObjectId;
  user_email? : string;
  user_token?: string; 
  isAdmin?: boolean;
}
  export const EMAIL_TEMPLATES = {
    
    SUBSCRIPTION_SUCCESSFUL: getEnv("SUBSCRIPTION_SUCCESSFUL")
    
   }

export type EMAIL_TEMPLATES_TYPES =  keyof typeof EMAIL_TEMPLATES;
 
export type EmailData = {
receiver: string;
message: string;
template: EMAIL_TEMPLATES_TYPES;
subject: string,
type: string, // this is for eventbridge
detailType: string, // this is for eventbridge
data?: GeneralObject

}
 
 

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

export interface StripeCustomer {
  id: string;
  name?: string;
  email: string;
}

 


  export type STATUSCODE = keyof typeof STATUSCODE_ENUM;
   