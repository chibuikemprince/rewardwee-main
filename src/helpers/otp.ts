// import redis module to save otp
// import { redis } from "../config/redis";


import { get } from "http";
import { EmailData, RESPONSE_TYPE, OtpData } from "./customTypes";
import { ErrorDataType, LogError } from "./errorReporting";
import { sendEmail } from "./mail";
import { RedisGet, RedisSet } from "./redis";
import { getEnv } from "./getEnv";

export const sendOtp = (data : EmailData, otp: string ): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {


        const { receiver, message, template, subject , type, detailType} = data;

 //save to redis
    let key = `${receiver}-activation-otp`;
let failedKey = `${key}-failed`;
    otp = otp.toUpperCase();
    console.log({otp})

let resendKey = `${key}-time`;

RedisGet(resendKey)
.then((resendTime: any)=>{  
     
    resendTime = resendTime ? resendTime : 0;

    let resendDuration = getEnv("OTP_RESEND_DURATION") as number;
    let now = Date.now();
    let diff = now - resendTime;
  
    diff =diff/60000;

    if(diff<resendDuration){

        let remaininDuration = resendDuration-diff;

        let response: RESPONSE_TYPE = {
            data: [{time_left: `${remaininDuration.toString().substr(0,3)} mins`}],
            message: `otp can only be resent after ${resendDuration} mins.`,
            status: 403,
            statusCode: "FORBIDDEN"
        }
        reject(response);
        return;
    }
    else{
        console.log("resend duration passed")



        RedisSet(key, otp as string)
        .then((done: any)=>{
            console.log("otp saved to redis")
    // send otp to receiver
    
    //mark failed trials
    RedisSet(failedKey, 0)
    .then((failedCount: any)=>{})
    .catch((failedCountErr: any)=>{})
    
    // mark resend duration
    
    RedisSet(resendKey, Date.now().toString())
    .then((resendKeyCount: any)=>{})
    .catch((resendKeyCountErr: any)=>{})
    
    
    sendEmail(data)
    .then((done: RESPONSE_TYPE)=>{
    
        resolve(done);
        return;
    })
    .catch((err: any)=>{
        let error: ErrorDataType = {
            msg:`Error sending otp. Error: ${err.message}` ,
            status: "STRONG",
            time:   new Date().toUTCString(),
            stack:err.stack,
            class: <string> <unknown>this
        }
    
    LogError(error);
    let failedToSendOtp: RESPONSE_TYPE = {
        data: [],
        message: "otp not sent successfully, please try again.",
        status: 500,
        statusCode: "UNKNOWN_ERROR"
    }
    reject(failedToSendOtp);
    
    return;
    
    
    })
    
    
    
    
    
            let sent: RESPONSE_TYPE = {
                data: [],
                message: "otp sent successfully.",
                status: 200,
                statusCode: "SUCCESS"
            }
            resolve(done);
            return;
    
        })
        .catch((err: any)=>{
            let error: ErrorDataType = {
                msg:`Error saving otp to redis. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }
    
    LogError(error);
    let failedToSaveToRedis: RESPONSE_TYPE = {
        data: [],
        message: "otp not sent successfully, please try again.",
        status: 500,
        statusCode: "UNKNOWN_ERROR"
    }
    reject(failedToSaveToRedis);
    return;
    
    
        })
    
    



    }
})
.catch((err: any)=>{

    let error: ErrorDataType = {
        msg:`Error getting otp resend duration from redis. Error: ${err.message}` ,
        status: "STRONG",
        time:   new Date().toUTCString(),
        stack:err.stack,
        class: <string> <unknown>this
    }

LogError(error);

let failedToGetResendDuration: RESPONSE_TYPE = {
    data: [],
    message: "otp not sent successfully, please try again.",
    status: 500,
    statusCode: "UNKNOWN_ERROR"
}

reject(failedToGetResendDuration);
return;


})




      

    })

}


export const confirmOtp = (data : OtpData ): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {
        let {email, otp} = data;

        otp = otp.toUpperCase();

        let key = `${email}-activation-otp`;


        let failedKey = `${key}-failed`;

        //check the number of otp failures/ wrong otp trials
        RedisGet(failedKey)
        .then((failed: any)=>{
            
        failed = failed ? failed : 0;
        
        let max_otp_failure = getEnv( "MAX_OTP_FAILURE") as number;
        
        if(failed>=max_otp_failure){
            let response: RESPONSE_TYPE = {
                data: [],
                message: "otp failed too many times, please request for new otp.",
                status: 403,
                statusCode: "FORBIDDEN"
            }
        
            reject(response);
        
        
        return;
            
        }
        else{

            // check if otp is valid
 
        RedisGet(key)
        .then((myotp: any)=>{

             if(myotp==otp){
let response: RESPONSE_TYPE = {
    data: [],
    message: "otp confirmed successfully.",
    status: 200,
    statusCode: "SUCCESS"
}

resolve(response);
return;



             }
             else{

                RedisSet(failedKey, failed+1)
                .then((failedCount: any)=>{})
                .catch((failedCountErr: any)=>{})


                let response: RESPONSE_TYPE = {
                    data: [],
                    message: "your otp is incorrect.",
                    status: 403,
                    statusCode: "FORBIDDEN"
                }

                reject(response);
                return;


             }
        })

        .catch((err: any) =>{

            let error: ErrorDataType = {
                msg:`Error getting otp from redis. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }

        LogError(error);
        let failedToGetFromRedis: RESPONSE_TYPE = {
            data: [],
            message: "otp not fetched successfully, please try again.",
            status: 500,
            statusCode: "UNKNOWN_ERROR"
        }

        resolve(failedToGetFromRedis);
        return;




        })
        }
    
        })
        .catch((err: any)=>{
            let error: ErrorDataType = {
                msg:`Error getting otp failed count from redis. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }
        
        LogError(error);
        
        
        let response: RESPONSE_TYPE = {
            data: [],
            message: "otp not confirmed successfully, please try again.",
            status: 403,
            statusCode: "UNKNOWN_ERROR"
        }
        
        reject(response);
        return;
        })
        
        










    })

}


