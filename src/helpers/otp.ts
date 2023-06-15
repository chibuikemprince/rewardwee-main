// import redis module to save otp
// import { redis } from "../config/redis";


import { EmailData, RESPONSE_TYPE } from "./customTypes";
import { ErrorDataType, LogError } from "./errorReporting";
import { set } from "./redis";

export const sendOtp = (data : EmailData, otp: string ): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {


        const { receiver, message, template, subject } = data;


 //save to redis
    let key = `${receiver}-activation-otp`;
 set(key, otp)
    .then((done: any)=>{
        console.log("otp saved to redis")
// send otp to receiver

sendEmail(receiver, message, template, subject)



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
resolve(failedToSaveToRedis);
return;


    })




      

    })

}