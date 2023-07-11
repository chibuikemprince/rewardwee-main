// import redis module to save otp
// import { redis } from "../config/redis";


import { EmailData, RESPONSE_TYPE, OtpData } from "./customTypes";
import { ErrorDataType, LogError } from "./errorReporting";
import { sendEmail } from "./mail";
import { RedisGet, RedisSet } from "./redis";

export const sendOtp = (data : EmailData, otp: string ): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {


        const { receiver, message, template, subject , type, detailType} = data;


 //save to redis
    let key = `${receiver}-activation-otp`;
    RedisSet(key, otp)
    .then((done: any)=>{
        console.log("otp saved to redis")
// send otp to receiver

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




      

    })

}


export const confirmOtp = (data : OtpData ): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {
        let {email, otp} = data;
        let key = `${email}-activation-otp`;
        RedisGet(key)
        .then((myotp: any)=>{
             if(myotp===otp){
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

                let response: RESPONSE_TYPE = {
                    data: [],
                    message: "please enter a valid otp.",
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

    })

}


