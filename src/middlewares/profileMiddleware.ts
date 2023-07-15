import { Request, Response, NextFunction } from "express";
import ProfileController  from "../controllers/profile" 
import  * as ProfileSchema  from "../middlewares/schemas/profile" 
 
import { response } from "../helpers/misc";
import { MyHttpRequest, RESPONSE_TYPE } from "../helpers/customTypes";
import { ObjectId } from "mongoose";

class ProfileMiddleware {

    constructor(){
        console.log("Auth Login Controller Started. ")
    }

public getUserProfile  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
         
        ProfileController.getProfile(req.user_id as ObjectId)
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




public searchOtherUsers  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{

        if(!req.body.hasOwnProperty("searchParams") || typeof req.body.searchParams != "object" || Object.entries(req.body.searchParams).length==0){
            let errResponse: RESPONSE_TYPE = {
                data:[],
                message: "No search parameters were provided",
                status: 400,
                statusCode: "BAD_REQUEST"


            }

            response(res, errResponse);
             return

        }
        ProfileSchema.searchUsersProfileSchema.validateAsync(req.body.searchParams)
            .then((data: any)=>{
               //skip: number, timeStart: number, timeStop: number
               if(req.body.skip == undefined || Number.isNaN(Number(req.body.skip))){
                req.body.skip = 0
               }
               ProfileController.filterUsers(data, req.body.skip)
               
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



// 

public updateProfileData  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{

      
        ProfileSchema.userDataUpdateSchema.validateAsync(req.body)
            .then((data: any)=>{
             
               ProfileController.updateProfile(req.user_id as ObjectId,data)
               
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


//updatePassword

public updatePassword  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{

      
        ProfileSchema.PasswordUpdateDataSchema.validateAsync(req.body)
            .then((data: any)=>{
             
               ProfileController.updatePassword(req.user_id as ObjectId,data)
               
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

// deleteAccount

public deleteAccount  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
         
        ProfileController.DeleteAccount(req.user_id as ObjectId, req.user_token as string)
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


export default new ProfileMiddleware();










