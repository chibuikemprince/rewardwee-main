import { Request, Response, NextFunction } from "express";
import { extractTokenContent, response } from "../helpers/misc";
import { MyHttpRequest, RESPONSE_TYPE } from "../helpers/customTypes";

import {authLogin} from "../modules/login" 
import mongoose, { ObjectId, Schema, Types } from "mongoose";

function extractTokenFromHeader(header: string | undefined): string | undefined {
    if (header == undefined) {
      return undefined;
    }
    
    const parts = header.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    
    return undefined;
  }
   
 export const isTokenCorrect = (req: MyHttpRequest, res: Response, next: NextFunction)=>{

    const authHeader = req.headers.authorization;
     const token = extractTokenFromHeader(authHeader);
     console.log({authHeader, token})

  if (token != undefined) {
     
// get token

extractTokenContent(token as string)
.then((verified: RESPONSE_TYPE)=>{
    console.log({verified})
let {id,
    email ,
    time  
} = verified.data[0];

let user_id = req.body.user_id

if(id != user_id){
    let error: RESPONSE_TYPE ={
        data: [],
        message: "invalid login token.",
        status: 400,
        statusCode: "LOGIN_FAILED"
    }
    console.log({error})
    response(res, error);
    return

}



authLogin.isUserLoggedIn(id, token as string)
.then((success: any)=>{

     
if(success.statusCode=="LOGIN_SUCCESSFUL"){

    req.user_id = id;
    req.user_email = email;
    req.user_token = token;
    
    next();
}
else{
    response(res, success);
    return;    
}
})
.catch((err: any)=>{
    response(res, err);
    return;
})



})
.catch((err: RESPONSE_TYPE)=>{
    console.log({err})
    response(res, err);
    return;
})


    }
    else{
        let error: RESPONSE_TYPE ={
            data: [],
            message: "invalid login token.",
            status: 400,
            statusCode: "LOGIN_FAILED"
        }
        console.log({error})
        response(res, error);
        return
    }
    
 }



