import { ObjectId, Types } from "mongoose"; 
import { getGlobalEnv } from "../modules";
import {Request} from "express"

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
    PASSWORD_RESET_TOKEN_SENT,
    INCORRECT_PASSWORD,
    BAD_REQUEST,
    LOGIN_RECORDS_FOUND,
    LOGIN_RECORDS_NOT_FOUND,
    ACCOUNT_ACTIVATED_ALREADY,
    PASSWORD_RESET_SUCCESSFUL
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
}
  export const EMAIL_TEMPLATES = {
    ACCOUNT_ACTIVATION: getGlobalEnv("ACCOUNT_ACTIVATION_EMAIL_TEMPLATE"),
    PASSWORD_RESET_TOKEN: getGlobalEnv("PASSWORD_RESET_TOKEN_EMAIL_TEMPLATE"),
    PASSWORD_RESET_SUCCESSFUL: getGlobalEnv("PASSWORD_RESET_SUCCESSFUL"),
    CHANGE_PASSWORD: getGlobalEnv("CHANGE_PASSWORD"),
    ACCOUNT_ACTIVATION_SUCCESS: getGlobalEnv("ACCOUNT_ACTIVATION_SUCCESS"),
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
 
export type LoginData= {
email?: string;
phoneNumber?: string;
password: string;

}


export type RegData = {

email: string;
password: string;
company: string;
team: string;
firstName: string;
lastName: string;
phoneNumber: string;
  
}

export type OtpData = {
  email: string;
  otp: string;
}

export interface TokenPayload {
  email: string;
  id: string;
  time: number;
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


export interface FilterUsers{
  email?: string;
  phoneNumber?: string;
  id?: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  company?: string;
  team?: string;
  status?: string;
  regDate_from?: number;
  regDate_to?: number;
  regDate?: GeneralObject;
  deleted?: boolean;

}


  export type STATUSCODE = keyof typeof STATUSCODE_ENUM;
   

  export interface profileUpdateData{

    firstName?: string;
    lastName?: string;
    company?: string;
    team?: string;
    phoneNumber?: string;
    role?: string;
    
     
  }

  export interface PasswordUpdateData{
    oldPassword: string;
    newPassword: string;
    
  }

  export interface statusUpdateData{
    status: string;
  }
