import { EmailData, RESPONSE_TYPE, RegData, OtpData } from "../helpers/customTypes"
import { ErrorDataType, LogError } from "../helpers/errorReporting";
import {getGlobalEnv, UserModel} from "../modules"


import { generateRandomString, hashPassword } from "../helpers/misc";  
import { confirmOtp, sendOtp } from "../helpers/otp";


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
        .then((hash: any)=>{
            UserModel.create({email, firstName, lastName, company, team, password : hash})
            .then((newUser: any)=>{

 generateRandomString(10)
            .then((otp_data: RESPONSE_TYPE)=>{
                let otp = otp_data.data[0];

                let emailData: EmailData ={
                    message: `Your otp is ${otp}`,
                       receiver: email,
                       subject: "Otp for account activation",
                       template: "ACCOUNT_ACTIVATION",
                       type: "single-template",
                       detailType:"account_activation"
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
            msg: err.msg,
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



/* 
       
 */
.catch((err: any)=>{
    let error: RESPONSE_TYPE = {
        data:[],
        message: "unknown error occurred, please try again.",
        status: 500,
        statusCode: "UNKNOWN_ERROR"
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

UserModel.updateOne({email}, {isEmailVerified: true, emailVerifiedAt: new Date()})
.then((done: any)=>{
    

    done.message = "Account activated successfully.";
    resolve(done);
    return;
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
        status: 404,
        statusCode: "USER_NOT_FOUND"
          }
            reject(error);
            return;

}   
else{

    generateRandomString(10)
            .then((otp_data: RESPONSE_TYPE)=>{
                let otp = otp_data.data[0];

                let emailData: EmailData ={
                    message: `Your otp is ${otp}`,
                       receiver: email,
                       subject: "Otp for account activation",
                       template: "ACCOUNT_ACTIVATION",
                       type: "single-template",
                       detailType:"account_activation"
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
    msg:err.msg,
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