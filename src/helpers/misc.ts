
import DotEnv from "dotenv"

DotEnv.config( {
  path:"../../.env"
});

import { Response } from 'express';
import { RESPONSE_TYPE, TokenPayload } from './customTypes';

import jwt from 'jsonwebtoken';
import { getEnv } from './getEnv';
import bcrypt from 'bcryptjs';
import { resolve } from "path";
import { ErrorDataType, LogError } from "./errorReporting";
import { Readable } from 'stream';



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

 
// function to hash password
/**
 * A function that hashes a given password.
 * 
 * @param password  - password to be hashed.
 * @returns - a promise that resolves to a RESPONSE_TYPE object.
 * 
 * @remarks
 * This function uses the bcryptjs library to hash the password.
 * 
 * @beta
 * 
 * @example
 * 
 * hashPassword("password")
 * .then((done: RESPONSE_TYPE)=>{
 * console.log(done);
 * })
 * .catch((err: RESPONSE_TYPE)=>{
 * console.log(err);
 * })
 * 
 */ 
 export const  hashPassword = (password: string): Promise<RESPONSE_TYPE> => {
return new Promise((resolve: any, reject: any)=>{
try{
 bcrypt.genSalt(10)
  .then((salt:any)=>{
    bcrypt.hash(password, salt)
    .then((hash: any)=>{

    let done: RESPONSE_TYPE = {
     data: [hash],
     message: "password hashed.",
     status: 200,
     statusCode: "SUCCESS" 
    }
      resolve(done);
    })
  })
  }
  catch(err: any){

    let error: RESPONSE_TYPE = {
      data: [],
      message: "unknown error occurred, please try again.",
      status: 500,
      statusCode: "FORM_REQUIREMENT_ERROR"
      }

      let error_type: ErrorDataType = {
        msg:err.msg,
        status: "STRONG",
        time:   new Date().toUTCString(),
        stack:err.stack,
        class: <string> <unknown>this
    }
    LogError(error_type);
    reject(error);

  return ;
  }
  
})

}




// function to verify if hash matches password
/**
 * A function that verifies if a given password matches a given hash.
 * 
 * 
 * @param password  - password to be verified.
 * @param hash  - hash to be verified.
 * @returns - a promise that resolves to a RESPONSE_TYPE object.
 * 
 * @remarks
 * This function uses the bcryptjs library to verify the password.
 * 
 * @beta
 * 
 * @example
 * 
 * verifyPassword("password", "hash")
 * .then((done: RESPONSE_TYPE)=>{
 * console.log(done);
 * })
 * .catch((err: RESPONSE_TYPE)=>{
 * console.log(err);
 * })
 * 
 */

  export const  verifyPassword = (password: string, hash: string): Promise<RESPONSE_TYPE> => {
return new Promise((resolve: any, reject: any)=>{
try{
  bcrypt.compare(password, hash)
  .then((match: any)=>{
    let done: RESPONSE_TYPE = {
      data: [match],
      message: "password verified.",
      status: 200,
      statusCode: "SUCCESS" 
      }
        resolve(done);
      }
    )
  }
  catch(err: any){
      
      let error: RESPONSE_TYPE = {
        data: [],
        message: "unknown error occurred, please try again.",
        status: 500,
        statusCode: "FORM_REQUIREMENT_ERROR"
        }
  
        let error_type: ErrorDataType = {
          msg:err.msg,
          status: "STRONG",
          time:   new Date().toUTCString(),
          stack:err.stack,
          class: <string> <unknown>this
      }
      LogError(error_type);
      reject(error);
      return;
  }
  
  })

}




/* hashing password done */

/**
 * A function that creates a jwt token. 
 * 
 * @param payload  - payload to be used in creating the token.
 * @returns - a promise that resolves to a string.
 * 
 * @remarks
 * 
 * This function uses the jsonwebtoken library to create the token.
 * 
 * @beta
 * 
 * @example
 * 
 * 
 * createJwtToken(payload)
 * .then((token: string)=>{
 * console.log(token);
 * })
 * .catch((err: any)=>{
 * console.log(err);
 * })
 * 
 */ 


export  const createJwtToken = (payload: TokenPayload): Promise<string> => {
 
  return new Promise((resolve: any, reject: any)=>{

    let secret = getEnv("JWT_SECRET") as string;
//console.log({secret})
     const token = jwt.sign(payload, secret, {
    expiresIn: '24h'
  });

  resolve(token);


  });



  
}
 

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
  
  let secret = getEnv("JWT_SECRET") as string;

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
 