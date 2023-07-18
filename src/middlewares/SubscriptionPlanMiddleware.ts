import { Request, Response, NextFunction } from "express";
import {SubscriptionPlanController}  from "../controllers/plans" 
import  * as SubscriptionPlansSchema  from "./schemas/subscriptionplans" 
 
import { response } from "../helpers/misc";
import { MyHttpRequest, RESPONSE_TYPE } from "../helpers/customTypes";
import { ObjectId } from "mongoose";

class ProfileMiddleware {

    constructor(){
        console.log("Auth Login Controller Started. ")
    }

 
 


// 

public createPlan  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{

      
        SubscriptionPlansSchema.CreateSubscriptionPlan.validateAsync(req.body)
            .then((data: any)=>{
             data.adminId = req.user_id as ObjectId
                SubscriptionPlanController.createPlan(data)
               
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



public getOnePlan  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{

      
        SubscriptionPlansSchema.GetSIngleSubscriptionPlan.validateAsync(req.body)
            .then((data: any)=>{
              
                SubscriptionPlanController.viewOnePlan(data.plan_id as ObjectId )
               
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




public getAllPlan  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
 
        SubscriptionPlanController.viewAllPlans()
               
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

 


public updatePlan  = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{

        if(!req.body.hasOwnProperty("updateParams") || typeof req.body.updateParams != "object" || Object.entries(req.body.updateParams).length==0){
            let errResponse: RESPONSE_TYPE = {
                data:[],
                message: "No update parameters were provided",
                status: 400,
                statusCode: "FORM_REQUIREMENT_ERROR"


            }

            response(res, errResponse);
             return

        }
      
        SubscriptionPlansSchema.UpdateSubscriptionPlan.validateAsync(req.body.updateParams)
            .then((data: any)=>{
             
if( !req.body.hasOwnProperty("plan_id") || typeof req.body.plan_id != "string" || req.body.plan_id.length <= 0){
    let errResponse: RESPONSE_TYPE = {
        data:[],
        message: "No plan id was provided",
        status: 400,
        statusCode: "FORM_REQUIREMENT_ERROR"


    }

    response(res, errResponse);
     return


}

                SubscriptionPlanController.updatePlan( req.body.plan_id as ObjectId, data)
               
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


}


export default new ProfileMiddleware();










