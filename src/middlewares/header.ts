

import { UserLoginRecord } from "../databases/external";
import {MyHttpRequest, isTokenCorrect as correctToken} from "rewardwee_auth_access" 
import { getGlobalEnv } from "../modules/globalEnv";
import { NextFunction, Response } from "express";
 
 export const isTokenCorrect = (req: MyHttpRequest, res: Response, next: NextFunction)=>{
 req.body.jk = getGlobalEnv("JWT_SECRET") as string;
 req.body.UserLoginRecord = UserLoginRecord; 
 correctToken(req, res, next)   ; 


 }