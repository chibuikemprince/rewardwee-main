import { Request, Response, NextFunction } from "express";
import * as RegisterController from  "../controllers/register";
import * as RegSchema from "../middlewares/schemas/register";
import { response } from "../helpers/misc";
import { RESPONSE_TYPE } from "../helpers/customTypes";


class RegistrationMiddleware{

    constructor(){
        console.log("RegistrationMiddleware constructor called");
    }


public register =  (req: Request, res: Response, next: NextFunction) => {

    try{
         
        RegSchema.registerSchema.validateAsync(req.body)
        .then((data: any)=>{
            

            RegisterController.formReg(data)
            .then((data: RESPONSE_TYPE)=>{
                
                response(res, data);
                return;
            })
            .catch((err: RESPONSE_TYPE)=>{
                response(res, err);
                return;
            })

        }
        )
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
catch(err){
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


public activateAccount =  (req: Request, res: Response, next: NextFunction) => {

    try{
         
        RegSchema.ActivateAccount.validateAsync(req.body)
        .then((data: any)=>{
            
            
            RegisterController.activateAccount(data)
            .then((data: RESPONSE_TYPE)=>{
                console.log({data});
                response(res, data);
                return;
            })
            .catch((err: RESPONSE_TYPE)=>{
                response(res, err);
                return;
            })

        }
        )
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
catch(err){
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


public resendActivation =  (req: Request, res: Response, next: NextFunction) => {

    try{
         
        RegSchema.resendActivationCode.validateAsync(req.body)
        .then((data: any)=>{
            
            console.log({data});
               
            RegisterController.resendActivationCode(data.email)
            .then((data: RESPONSE_TYPE)=>{
                 response(res, data);
                return;
            })
            .catch((err: RESPONSE_TYPE)=>{
                response(res, err);
                return;
            })

        }
        )
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
catch(err){
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

export default new RegistrationMiddleware();