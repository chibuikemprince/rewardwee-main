import { Request, Response, NextFunction } from "express";
import {AuthLogin} from "../controllers/login" 
import  * as LogSchema  from "../middlewares/schemas/login" 
 
import { response } from "../helpers/misc";
import { MyHttpRequest, RESPONSE_TYPE } from "../helpers/customTypes";
import { ObjectId } from "mongoose";

class LoginMiddleware {

    constructor(){
        console.log("Auth Login Controller Started. ")
    }

public login  = (req: Request, res: Response, next: NextFunction) => {

    try{
         
        LogSchema.loginRequest.validateAsync(req.body)
        .then((data: any)=>{
            AuthLogin.login(data)
            .then((data: RESPONSE_TYPE)=>{
                
                response(res, data);
                return;
            })
            .catch((err: RESPONSE_TYPE)=>{
                response(res, err);
                return;
            })
        })
        .catch((err: any)=>{
            console.log({err, d: err.details[0]});

            err.details[0].message = err.details[0].message.replace(/"/g, "");
            if(err.details[0].message.includes("fails to match the required pattern")){
            err.details[0].message =    `Invalid ${err.details[0].context.key}`;
            }
            let feedback: RESPONSE_TYPE = {
                message: err.details[0].message,
                data: err.details,
                status: 400,
                statusCode: "FORM_REQUIREMENT_ERROR"
            }
            response(res, feedback);
            return;
        })


    }

    catch(err: any){
        let feedback: RESPONSE_TYPE = {
            message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
            data: [],
            status: 500,
            statusCode: "UNKNOWN_ERROR"
        }
        response(res, feedback);
        return;
    }

}

public sendPasswordRecoveryCode  = (req: Request, res: Response, next: NextFunction) => {

    try{
         
        LogSchema.requestResetPasswordOtp.validateAsync(req.body)
        .then((data: any)=>{
            AuthLogin.forgot_password(data.email)
            .then((data: RESPONSE_TYPE)=>{
                
                response(res, data);
                return;
            })
            .catch((err: RESPONSE_TYPE)=>{
                response(res, err);
                return;
            })
        })
        .catch((err: any)=>{
            console.log({err, d: err.details[0]});

            err.details[0].message = err.details[0].message.replace(/"/g, "");
            if(err.details[0].message.includes("fails to match the required pattern")){
            err.details[0].message =    `Invalid ${err.details[0].context.key}`;
            }
            let feedback: RESPONSE_TYPE = {
                message: err.details[0].message,
                data: err.details,
                status: 400,
                statusCode: "FORM_REQUIREMENT_ERROR"
            }
            response(res, feedback);
            return;
        })


    }

    catch(err: any){
        let feedback: RESPONSE_TYPE = {
            message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
            data: [],
            status: 500,
            statusCode: "UNKNOWN_ERROR"
        }
        response(res, feedback);
        return;
    }

}




public resetPassword  = (req: Request, res: Response, next: NextFunction) => {

    try{
         
        LogSchema.resetPassword.validateAsync(req.body)
        .then((data: any)=>{
            AuthLogin.confirm_password_reset(data.email, data.otp, data.newpassword)
            .then((data: RESPONSE_TYPE)=>{
                
                response(res, data);
                return;
            })
            .catch((err: RESPONSE_TYPE)=>{
                response(res, err);
                return;
            })
        })
        .catch((err: any)=>{
            console.log({err, d: err.details[0]});

            err.details[0].message = err.details[0].message.replace(/"/g, "");
            if(err.details[0].message.includes("fails to match the required pattern")){
            err.details[0].message =    `Invalid ${err.details[0].context.key}`;
            }
            let feedback: RESPONSE_TYPE = {
                message: err.details[0].message,
                data: err.details,
                status: 400,
                statusCode: "FORM_REQUIREMENT_ERROR"
            }
            response(res, feedback);
            return;
        })


    }

    catch(err: any){
        let feedback: RESPONSE_TYPE = {
            message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
            data: [],
            status: 500,
            statusCode: "UNKNOWN_ERROR"
        }
        response(res, feedback);
        return;
    }

}


//getUserLoginRecords


public getUserLoginRecords  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
         
        LogSchema.getLoginRecordParams.validateAsync(req.body)
        .then((data: any)=>{
           //skip: number, timeStart: number, timeStop: number
           let {next, durationStart, durationStop} = data;

        AuthLogin.getUserLoginRecords(req.user_id as ObjectId, next, durationStart, durationStop)
        .then((data: RESPONSE_TYPE)=>{
            
            response(res, data);
            return;
        })
        .catch((err: RESPONSE_TYPE)=>{
            response(res, err);
            return;
        })



        })
        .catch((err: any)=>{
            console.log({err, d: err.details[0]});

            err.details[0].message = err.details[0].message.replace(/"/g, "");
            if(err.details[0].message.includes("fails to match the required pattern")){
            err.details[0].message =    `Invalid ${err.details[0].context.key}`;
            }
            let feedback: RESPONSE_TYPE = {
                message: err.details[0].message,
                data: err.details,
                status: 400,
                statusCode: "FORM_REQUIREMENT_ERROR"
            }
            response(res, feedback);
            return;
        })


    }

    catch(err: any){

        let feedback: RESPONSE_TYPE = {
            message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
            data: [],
            status: 500,
            statusCode: "UNKNOWN_ERROR"
        }
        response(res, feedback);
        return;
    }

}


// logout

public logout = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
         
        AuthLogin.logout(req.user_token as string)
        .then((data: RESPONSE_TYPE)=>{
            
            response(res, data);
            return;
        })
        .catch((err: RESPONSE_TYPE)=>{
            response(res, err);
            return;
        })

    }

    catch(err: any){

        let feedback: RESPONSE_TYPE = {
            message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
            data: [],
            status: 500,
            statusCode: "UNKNOWN_ERROR"
        }
        response(res, feedback);
        return;

    }

}

}


export default new LoginMiddleware();










