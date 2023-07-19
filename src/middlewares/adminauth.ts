import { NextFunction, Response } from "express";
import { MyHttpRequest } from "../helpers/customTypes";
import { RESPONSE_TYPE } from "../helpers/customTypes";
import { response } from "../helpers/misc";

export const isAdminTokenCorrect = (req: MyHttpRequest, res: Response, next: NextFunction)=>{
    if(req.headers.authorization)
{
    let token = req.headers.authorization.split(' ') 
     
    req.user_id = token[2] as any;
     
 next();
}
  else{

    let err: RESPONSE_TYPE = {
        status: 401,
        message: "Unauthorized",
        data: [],
        statusCode: "UNKNOWN_ERROR"
  } 

  response(res, err);
  return;

}

}