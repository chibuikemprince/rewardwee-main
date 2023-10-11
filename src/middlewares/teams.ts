import { Request, Response, NextFunction } from "express";
import { MyHttpRequest, RESPONSE_TYPE } from "../helpers/customTypes";
import * as TeamsSchema from "./schemas/teams"
import TeamModule from "../controllers/teams" 
import { response } from "../helpers/misc";

class TeamsMiddleware {

    constructor(){ 
    }
  
//create teams



public createTeams = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
        
           req.body.user_id = req.user_id;
            
           TeamsSchema.createTeams.validateAsync(req.body)
            .then((data: any)=>{
            
                TeamModule.createTeam(
                    req.body.name,
                    req.body.user_id,
                    req.body.description,
                    )
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




public updateTeams = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
        
           req.body.user_id = req.user_id;
            
           TeamsSchema.updateTeams.validateAsync(req.body)
            .then((data: any)=>{
            
                TeamModule.updateTeam ( 
                    req.body.user_id,
                    req.body,
                    )
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



public getTeamsByName = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
        
           req.body.user_id = req.user_id;
            
           TeamsSchema.getTeamsByName.validateAsync(req.body)
            .then((data: any)=>{
            
                TeamModule.getATeamByName ( 
                    req.body.name
                    )
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




public getTeamsById = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
        
           req.body.user_id = req.user_id;
            
           TeamsSchema.getTeamsById.validateAsync(req.body)
            .then((data: any)=>{
            
                TeamModule.getATeam ( 
                    req.body.team_id
                    )
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

public getTeamsByCreators = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
        
           req.body.user_id = req.user_id;
            
           TeamsSchema.getTeamsByUser.validateAsync(req.body)
            .then((data: any)=>{
            
                TeamModule.fetchTeamsByUser ( 
                    req.body.team_creator_id
                    )
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




public deleteTeam = (req: MyHttpRequest, res: Response, next: NextFunction) => {

    try{
        
           req.body.user_id = req.user_id;
            
           TeamsSchema.deleteTeam.validateAsync(req.body)
            .then((data: any)=>{
            
                TeamModule.deleteTeam ( 
                    req.body.team_id,
                    req.body.user_id
                    )
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


export default new TeamsMiddleware();










