import { EmailData, RESPONSE_TYPE, RegData, OtpData } from "../helpers/customTypes"
import { ErrorDataType, LogError } from "../helpers/errorReporting";
import {getGlobalEnv} from "../modules"
import {UserModel} from "../databases/external"


import { generateRandomString, hashPassword } from "../helpers/misc";  
import { confirmOtp, sendOtp } from "../helpers/otp";
import mongoose from "mongoose";
import { getEnv } from "../helpers/getEnv";
import { sendEmail } from "../helpers/mail";


export const formReg = (data: RegData): Promise<RESPONSE_TYPE> => {

return new Promise((resolve: any, reject: any)=>{


    const {email, password, company, team, firstName, lastName } = data;


  //  email, password, company and firstname must be set.

    if(!email || !password || !company || !firstName || !team ){
        let error: RESPONSE_TYPE = {
            data:[],
            message: "Enter all required parameter.",
            status: 400,
            statusCode: "FORM_REQUIREMENT_ERROR"
              }
                reject(error);
                return;
    }
 
    const readyState = mongoose.connection.readyState;
   // console.log({dbConnection: readyState, email }) ;
    
       // checking user exist 
          UserModel.findOne({email})

.then((oldUser: any)=>{
    

   
    try { 
        
        if(oldUser){ 

        let error: RESPONSE_TYPE = {
            data:[],
            message: 'User with this email already exist. ',
            status: 409,
            statusCode: "RESOURCE_ALREADY_EXIST"
           }
    
           reject(error);
           return;



    }

    else{
        // creating new user
        hashPassword(password)
        .then((hashData: any)=>{
            let hash = hashData.data[0];
            UserModel.create({email, firstName, lastName, company, team, password : hash})
            .then((newUser: any)=>{

 generateRandomString(getEnv("ACCOUNT_ACTIVATION_OTP_LENGTH") as number )
            .then((otp_data: RESPONSE_TYPE)=>{
                let otp = otp_data.data[0];
                otp = otp.toUpperCase();
                let emailData: EmailData ={
                    message: `Your otp is ${otp}`,
                       receiver: email,
                       subject: "Otp for account activation",
                       template: "ACCOUNT_ACTIVATION",
                       type: "single-template",
                       detailType:"account_activation",
                       data: {code: otp}
              }


               sendOtp(emailData,otp)
                 .then((done: RESPONSE_TYPE)=>{
let success: RESPONSE_TYPE={
    data: [{
        email: newUser.email
    }],
    message: "Account created successfully, kindly activate your account with the code sent to your email.",
    status: 200,
    statusCode: "SUCCESS"

}

                     resolve(success);

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
reject(err);
return;
 

                })

            })
            .catch((err: any)=>{
                let error: ErrorDataType = {
                    msg:`Error generating otp. Error: ${err.message}` ,
                    status: "STRONG",
                    time:   new Date().toUTCString(),
                    stack:err.stack,
                    class: <string> <unknown>this
                }

LogError(error);
reject(err);
return;

 

            })
            //


                

/* 

                let done: RESPONSE_TYPE = {
                    data: [],
                    message: "Account created successfully, kindly activate your account with the link sent to your email.",
                    status: 200,
                    statusCode: "SUCCESS"
                     }
                        resolve(done);
                        return;


                         */


            })
        })
        .catch((err: any)=>{
            let error: RESPONSE_TYPE = {
                data:[],
                message: "unknown error occurred, please try again.",
                status: 500,
                statusCode: "FORM_REQUIREMENT_ERROR"
                  }
                    reject(error); 
                    
                    let error_log: ErrorDataType = {
            msg: err.message,
            status: "STRONG",
            time:   new Date().toUTCString(),
            stack:"User not created successfully.",
            class: <string> <unknown>this
        }
        LogError(error_log);
       
                    return;
        })

       

    }


    }

    catch (err: any) {
        // res.status(500).send({error, message : "There was an Error"}) 
  
  
        let error: RESPONSE_TYPE = {
          data:[],
          message: "unknown error occurred, please try again.",
          status: 500,
          statusCode: "FORM_REQUIREMENT_ERROR"
         }
 // console.log({err})
  let error_type: ErrorDataType = {
      msg: err.message,
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



/* 
       
 */
.catch((err: any)=>{
  //  console.log({err})
    let error: RESPONSE_TYPE = {
        data:[],
        message: "unknown error occurred, please try again.",
        status: 500,
        statusCode: "UNKNOWN_ERROR"
       }

let error_type: ErrorDataType = {
    msg:err.message,
    status: "STRONG",
    time:   new Date().toUTCString(),
    stack:err.stack,
    class: <string> <unknown>this
}

LogError(error_type);
       reject(error);
       return;
})
    
  

})



}

export const activateAccount = (data: OtpData): Promise<RESPONSE_TYPE> => {

return new Promise((resolve: any, reject: any)=>{

let {email, otp} = data;

if(!email || !otp){
    let error: RESPONSE_TYPE = {
        data:[],
        message: "Enter all required parameter.",
        status: 400,
        statusCode: "FORM_REQUIREMENT_ERROR"
          }
            reject(error);
            return;


        }
        else{
confirmOtp(data)
.then((done: RESPONSE_TYPE)=>{

UserModel.findOneAndUpdate({email, isEmailVerified: false}, {isEmailVerified: true, emailVerifiedAt: new Date()}, {new: true} )
.then((updatedData: any)=>{
   // console.log({updated: done})
if(updatedData.isEmailVerified == false){
    let error: RESPONSE_TYPE = {
        data:[],
        message: "Account activation failed, please try again.",
        status: 500,
        statusCode: "UNKNOWN_ERROR"


    }
    reject(error);
    return;
}

else{
    let done: RESPONSE_TYPE = {
        data:[],
        message: "Account activated successfully.",
        status: 200,
        statusCode: "SUCCESS"
    }
    

let emailData: EmailData = {
    message: `Your account has been activated successfully.`,
         receiver: email,

            subject: "Account activation successful",
            template: "ACCOUNT_ACTIVATION_SUCCESS",
            type: "single-template",
            detailType:"account_activation",
            data: {firstName: updatedData.firstName, lastName: updatedData.lastName, email: updatedData.email}
    }

sendEmail(emailData)
.then((done: RESPONSE_TYPE)=>{
    //console.log({done})
})
.catch((err: any)=>{
   // console.log({err})
})


    resolve(done);
    return;
    
}
})

.catch((err: any)=>{

let activationFailed: RESPONSE_TYPE = {
    data:[],
    message: "Account activation failed.",
    status: 500,
    statusCode: "UNKNOWN_ERROR"
    }

    reject(activationFailed);
    return;


})

})

.catch((err: any)=>{
    reject(err);
    return;

})

        }
})

}


export const resendActivationCode = (email: string): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any)=>{

//check if user already registered and not activated

UserModel.findOne({email, isEmailVerified: false})
.then((user: any)=>{

if(user === null){
    let error: RESPONSE_TYPE = {
        data:[],
        message: "Seems you have activated your account already, kindly login or have not yet registered.",
        status: 400,
        statusCode: "ACCOUNT_ACTIVATED_ALREADY"
          }
            reject(error);
            return;

}   
else{

    generateRandomString( getEnv("ACCOUNT_ACTIVATION_OTP_LENGTH") as number )
            .then((otp_data: RESPONSE_TYPE)=>{
                let otp = otp_data.data[0];
                otp = otp.toUpperCase();
                let emailData: EmailData ={
                    message: `Your otp is ${otp}`,
                       receiver: email,
                       subject: "Otp for account activation",
                       template: "ACCOUNT_ACTIVATION",
                       type: "single-template",
                       detailType:"account_activation",
                       data: {code: otp}
              }


               sendOtp(emailData,otp)
                 .then((done: RESPONSE_TYPE)=>{
let success: RESPONSE_TYPE={
    data: [{
        email
    }],
    message: "Otp sent successfully, kindly activate your account with the code sent to your email.",
    status: 200,
    statusCode: "SUCCESS"

}

                     resolve(success);

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
reject(err);
return;
 

                })

            })
            .catch((err: any)=>{
                let error: ErrorDataType = {
                    msg:`Error generating otp. Error: ${err.message}` ,
                    status: "STRONG",
                    time:   new Date().toUTCString(),
                    stack:err.stack,
                    class: <string> <unknown>this
                }

LogError(error);
reject(err);
return;

 

            }) 
}
 

})

.catch((err: any)=>{
    let error: RESPONSE_TYPE = {
        data:[],
        message: "unknown error occurred, please try again.",
        status: 500,
        statusCode: "UNKNOWN_ERROR"
       }

let error_type: ErrorDataType = {
    msg:err.message,
    status: "STRONG",
    time:   new Date().toUTCString(),
    stack:err.stack,
    class: <string> <unknown>this
}

LogError(error_type);
         reject(error);
            return;

})


    })

}
/* 

formReg({
    "firstName":"Prince",
    "lastName": "Chisomaga",
    "email":"youngprince042@gmail.com",
    "phoneNumber":"+2348066934496",
    "password":"123456",
    "company":"rewardwee",
    "team": "enginerring"

    
})
.then((done: any)=>{
    console.log(done)
}   
)
.catch((err: any)=>{
console.log(err)
}) */
