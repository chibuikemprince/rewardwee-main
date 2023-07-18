 
import { Response } from 'express';
import { RESPONSE_TYPE } from './customTypes';
import jwt from 'jsonwebtoken';
import { getEnv } from './getEnv';
import { getGlobalEnv } from "../modules/globalEnv";  
import { ErrorDataType, LogError } from "./errorReporting";
import { Readable } from 'stream';

//let dsecret = getGlobalEnv("JWT_SECRET") as string;

//console.log({dsecret})
/**
 * A function that returns http response as a stream.
 * 
 * @param res - response object.
 * 
 * @param data - data to be sent as response.
 * 
 * @returns - a void promise.
 * 
 * @remarks - this function is used to send response to the client.
 * 
 * @beta
 * 
 * 
 *  
 */
 
export const response = (res: Response, data: RESPONSE_TYPE) => {
  data.status =
    data.status == undefined || data.status == null ? 500 : data.status;
let dataToJson = JSON.stringify(data);

  //res.status(data.status).json(data);
  res.writeHead(data.status, {
    'Content-Length': Buffer.byteLength(dataToJson),
    'Content-Type': 'application/json'
  });
  var stream = new Readable();
  stream.push(dataToJson);    // stream apparently does not accept objects
  stream.push(null);                    // this 
  
stream.pipe(res);

  return;
};




// function to generate random string
/**
 * A function that generates a random string of a given length.
 * 
 * @param length  - length of the string to be generated.
 * @returns - a promise that resolves to a RESPONSE_TYPE object.
 */
export const generateRandomString = (length: number): Promise<RESPONSE_TYPE> => {
  return new Promise((resolve: any, reject: any) => {
    try {

  let result: string = "";
  let characters: string =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let charactersLength: number = characters.length;
  for (let i: number = 0; i < length; i++) {

    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  let done: RESPONSE_TYPE = {
    data: [result],
    message: "random string generated.",
    status: 200,
    statusCode: "SUCCESS"
  }
    resolve(done);
    return; 
    } catch (err: any) {
      let error_type: ErrorDataType = {
        msg:err.msg,
        status: "STRONG",
        time:   new Date().toUTCString(),
        stack:err.stack,
        class: <string> <unknown>this
    } 
    LogError(error_type);

    let error: RESPONSE_TYPE = {
      data: [],
      message: "unknown error occurred, please try again.",
      status: 500,
      statusCode: "UNKNOWN_ERROR"
      }
      reject(error);
      return; 
    }
  });

};



/* hashing password */

  
 



 

/**
 * A function that extracts the content of a jwt token.
 * 
 * @param token  - token to be extracted.
 * @returns - a promise that resolves to a RESPONSE_TYPE object.
 * 
 * 
 * @remarks
 * 
 * This function uses the jsonwebtoken library to extract the content of the token.
 * 
 * @beta
 * 
 * @example
 * 
 * 
 * extractTokenContent(token)
 * .then((done: RESPONSE_TYPE)=>{
 * console.log(done);
 * })
 * .catch((err: any)=>{
 * console.log(err);
 * })
 * 
 */ 

export const  extractTokenContent  =  (token: string): Promise<RESPONSE_TYPE> => {
  
  let secret = getGlobalEnv("JWT_SECRET") as string;

return new Promise((resolve:any, reject: any)=>{

  try {
    const decoded = jwt.verify(token, secret);

    if (decoded && typeof decoded === 'object' && 'id' in decoded && 'email' in decoded && 'time' in decoded) {
     
let token = {
  id: decoded.id,
  email: decoded.email as string,
  time: decoded.time
}
let done: RESPONSE_TYPE = {
data: [token],
message: "token verified.",
status: 200,
statusCode: "SUCCESS"


} 

     resolve(done)
     
      return ;




    }
  } catch (err) {
    
    let error: RESPONSE_TYPE ={
      data:[],
      message:'Failed to verify JWT token',
      status:500,
      statusCode:"UNKNOWN_ERROR"
        }
         reject(error);

return;

  }

  



})



}

/* jwt done */
 