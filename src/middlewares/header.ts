import { Request, Response, NextFunction } from "express";
import { extractTokenContent, response } from "../helpers/misc";
import { MyHttpRequest, RESPONSE_TYPE } from "../helpers/customTypes";

import {AuthLogin} from "../controllers/login" 

function extractTokenFromHeader(header: string | undefined): string[] | undefined {
    if (header == undefined) {
      return undefined;
    }
    
    const parts = header.split(' ');
    if (parts.length === 3 && parts[0] === 'Bearer') {

        // console.log({part1: parts[1], part2: parts[2] })
      return [parts[1], parts[2] ] ;
    }
    
    return undefined;
  }
   
 export const isTokenCorrect = (req: MyHttpRequest, res: Response, next: NextFunction)=>{

    const authHeader = req.headers.authorization;
     const tokenData = extractTokenFromHeader(authHeader);
     // console.log({authHeader, tokenData})

  if (tokenData != undefined) {
     let token = tokenData[0];
// get token

extractTokenContent(token as string)
.then((verified: RESPONSE_TYPE)=>{
    console.log({verified})
let {id,
    email ,
    time  
} = verified.data[0];

let user_id = tokenData[1]

console.log({token, user_id})
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


AuthLogin.isUserLoggedIn(id, token as string)
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