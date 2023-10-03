//login
//logout
//reset password
 
import { EmailData, LoginData, RESPONSE_TYPE, TokenPayload } from "../helpers/customTypes";
import { UserLoginRecord, UserModel } from "../databases/external";
import { ErrorDataType, LogError } from "../helpers/errorReporting";
import { createJwtToken, generateRandomString, hashPassword, verifyPassword } from "../helpers/misc";
import { RedisDelete, RedisSet, RedisGet } from "../helpers/redis";
import { sendEmail } from "../helpers/mail";
import { ObjectId } from "mongoose";
import { getEnv } from "../helpers/getEnv";


class AuthLoginClass{

  //logout
  //login
  //get login history
  // get login status

  resetPassword_Redis_Key : string;
  constructor(){
    console.log("auth log constructor")
    this.resetPassword_Redis_Key  = "reset_password_otp";
  }


    public login(data: LoginData): Promise<RESPONSE_TYPE>{

        return new Promise((resolve,reject)=>{

            let {email,phoneNumber, password} = data;

if(!email && !phoneNumber) {

    reject({
        data:[],
        message:"please enter email or phone number",
        status:403,
        statusCode:"FORBIDDEN"
    })
    return;
}
else {
if(!password){
    reject({
        data:[],
        message:"please enter password",
        status:403,
        statusCode:"FORBIDDEN"
    })
    return;

        
    
    }

// check if user is registered
let key = email ? "email" : "phoneNumber";
let filter = {[key]: email || phoneNumber};

UserModel.findOne(filter)
.then((user: any)=>{
    if(user === null){
        //usernot found

        let response: RESPONSE_TYPE = {
            data:[],
            message:"user not found",
            status:404,
            statusCode:"USER_NOT_FOUND"

        }

        reject(response)
        return;
    }
    else{

console.log({filter,user})
        if(user.status.toUpperCase() != "ACTIVE"){

            reject({data: [], message: "account not active, please contact admin", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
            return;
             }
            
             if(user.isEmailVerified != true && user.isPhoneNumberVerified != true){
            reject({data: [], message: "account not verified, please verify your account.", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
            return; 
            }
            
            
             if(user.deleted == true){
            reject({data: [], message: "user not found, account deleted.", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
            return;
             }
            
             let currentPasswordTrial :number =   user.passwordTrial ;
             currentPasswordTrial = Number.isNaN(Number(currentPasswordTrial))  ? 0: currentPasswordTrial;

            console.log({currentPasswordTrial});

             let envTrialLimit: number = getEnv("MAX_PASSWORD_TRIAL") as number 
             
             if( currentPasswordTrial >= envTrialLimit){
                 //LOGIN_FAILED
                 let trialResponse: RESPONSE_TYPE = {
                     data: [],
                     message: "you have exceeded the limit for failed login, kindly reset your password via password recovery.",
                     status: 429,
                     statusCode: "LOGIN_FAILED"
                 }
             
                 reject(trialResponse);
                 return;
             }

             verifyPassword(password, user.password)
.then((Match: RESPONSE_TYPE)=>{
 

    
     if(Match.statusCode == "INCORRECT_PASSWORD"){
        user.passwordTrial = currentPasswordTrial+1;
     }
     else if(Match.statusCode == "SUCCESS"){
        user.passwordTrial = 0;
     }

    user.save()
    .then((saved: any)=>{ console.log({saved}) })
    .catch((savedError: any)=>{ console.log({savedError}) })
    

    let isMatch: boolean = Match.statusCode== "SUCCESS" ? true : false;


    
    if(isMatch){

        //login successful
        // generate token
   

                let tokenpayload :TokenPayload = {

                    id: user._id,
                    email: user.email,
                    time: Date.now()
                }



                createJwtToken(tokenpayload)
                .then((token: string)=>{

// save login info
UserLoginRecord.updateMany({user_id: user._id}, {status: "INACTIVE"})
.then((done: any)=>{

 
    UserLoginRecord.create({
        user_id: user._id,email: user.email, token, status: "ACTIVE"})

        .then((done: any)=>{ 

            resolve({
                data:[{user_id: user._id,token}],
                message:"login successful",
                status:200,
                statusCode:"LOGIN_SUCCESSFUL"
            })
            
            return;
        })
        .catch((err: any)=>{
            let error_log: ErrorDataType   = {
                msg:`Error creating jwt token. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }

            LogError(error_log)
        })


})
.catch((err: any)=>{
    let error_log: ErrorDataType   = {
        msg:`Error updating user login status. Error: ${err.message}` ,
        status: "STRONG",
        time:   new Date().toUTCString(),
        stack:err.stack,
        class: <string> <unknown>this
    }

    LogError(error_log)

            let error_response: RESPONSE_TYPE = {
                data:[],
                message:"login not successful",
                status:500,
                statusCode:"LOGIN_FAILED"
            }

            reject(error_response)
            return;
})

 

          

            })
            .catch((err: any)=>{

                reject({
                    data:[],
                    message:"login not successful",
                    status:200,
                    statusCode:"LOGIN_FAILED"
                })
                return;
                
            })            

        }
        else{

            reject({
                data:[],
                message:"incorrect password",
                status:403,
                statusCode:"FORBIDDEN"
            })
            return;
        }

    })

    .catch((err: any)=>{
let error_log: ErrorDataType   = {
    msg:`Error checking user password. Error: ${err.message}` ,
    status: "STRONG",
    time:   new Date().toUTCString(),
    stack:err.stack,
    class: <string> <unknown>this
}

LogError(error_log)

        reject({
            data:[],
            message:"login failed",
            status:500,
            statusCode:"UNKNOWN_ERROR"
        })
        return;
    })


       
        }


        })
.catch((err: any)=>{

let error: ErrorDataType = {
    msg:`Error login user. Error: ${err.message}` ,
    status: "STRONG",
    time:   new Date().toUTCString(),
    stack:err.stack,
    class: <string> <unknown>this
}

LogError(error);
reject(err);


})



    }

})

    }


public logout(token: string): Promise<RESPONSE_TYPE>{

    return new Promise((resolve,reject)=>{

        UserLoginRecord.findOneAndUpdate({token}, {status: "INACTIVE"})
        .then((done: any)=>{

            resolve({
                data:[],
                message:"logout successful",
                status:200,
                statusCode:"LOGOUT_SUCCESSFUL"
            })
            return;
            
        })
        .catch((err: any)=>{

            let error_log: ErrorDataType   = {
                msg:`Error logging out user. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }
        
            LogError(error_log)
        
            reject({
                data:[],
                message:"logout not successful",
                status:500,
                statusCode:"UNKNOWN_ERROR"
            })
            return;
            
        })

    })

}




public forgot_password(email: string): Promise<RESPONSE_TYPE>{
    return new Promise((resolve,reject)=>{

        UserModel.findOne({email})
        .then((user: any)=>{

            if(user === null){
                //user not found
                reject({
                    data:[],
                    message:"user not found",
                    status:404,
                    statusCode:"USER_NOT_FOUND"
                })
                return;
            }
            else{
                //user found
                //send email

                //generate token
                //save token


                if(user.status.toUpperCase() != "ACTIVE"){

                    reject({data: [], message: "account not active, please contact admin", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                    return;
                     }
                    
                     if(user.isEmailVerified != true && user.isPhoneNumberVerified != true){
                    reject({data: [], message: "account not verified, please verify your account", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                    return; 
                    }
                    
                    
                     if(user.deleted == true){
                    reject({data: [], message: "user not found, account deleted", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                    return;
                     }
                    



// limit request

let key = `${email}-resetPassword_Redis_Key`;
let resendKey = `${key}-time`;

let failedKey = `${key}-failed`;


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




        generateRandomString(getEnv("OTP_LENGTH") as number)
        .then((token: RESPONSE_TYPE)=>{
            //save token
            let resettoken = token.data[0] as string;
            
            resettoken = resettoken.toUpperCase();
            //save to redis
            RedisSet(key, resettoken)
            .then((done: any)=>{

                // track number of failures to stop bruteforce
                RedisSet(failedKey, 0)
                .then((failedCount: any)=>{})
                .catch((failedCountErr: any)=>{})
                
                // mark resend duration
                
                RedisSet(resendKey, Date.now().toString())
                .then((resendKeyCount: any)=>{})
                .catch((resendKeyCountErr: any)=>{})
                


                //send email

                let email_data: EmailData = {
                    detailType: "password_reset",  
                    subject: "Password Reset",
                     message: `Your password reset token is ${resettoken}`,
                     type: "single-template",

                    template: "PASSWORD_RESET_TOKEN",
                    receiver: email,
                    data: {code: resettoken}
                }

console.log({email_data});

                sendEmail(email_data)
                .then((done: any)=>{

                    resolve({
                        data:[],
                        message:"password reset token sent",
                        status:200,
                        statusCode:"PASSWORD_RESET_TOKEN_SENT"
                    })
                    return;

                })
                .catch((err: any)=>{
console.log({err})
                    let error_log: ErrorDataType   = {
                        msg:`Error sending email. Error: ${err.message}` ,
                        status: "STRONG",
                        time:   new Date().toUTCString(),
                        stack:err.stack,
                        class: <string> <unknown>this
                    }
                
                    LogError(error_log)
                
                    reject({
                        data:[],
                        message:"password reset token not sent",
                        status:500,
                        statusCode:"UNKNOWN_ERROR"
                    })
                    return;


            })


        }) 
            .catch((err: any)=>{

                let error_log: ErrorDataType   = {
                    msg:`Error saving token to redis. Error: ${err.message}` ,
                    status: "STRONG",
                    time:   new Date().toUTCString(),
                    stack:err.stack,
                    class: <string> <unknown>this
                }
            
                LogError(error_log)
            
                reject({
                    data:[],
                    message:"unknown error",
                    status:500,
                    statusCode:"UNKNOWN_ERROR"
                })
                return;

            })





        })
        .catch((err: any)=>{
            let error_log: ErrorDataType   = {
                msg:`Error generating token. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }

            LogError(error_log)

            reject({
                data:[],
                message:"unknown error",
                status:500,
                statusCode:"UNKNOWN_ERROR"
            })

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




 
            }



        })
        .catch((err: any)=>{
            let error_log: ErrorDataType   = {
                msg:`Error finding user. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }
        
            LogError(error_log)
        
            reject({
                data:[],
                message:"unknown error",
                status:500,
                statusCode:"UNKNOWN_ERROR"
            })
            return;
        }
        )

    })

}



public confirm_password_reset(email: string, token: string, newpassword: string): Promise<RESPONSE_TYPE>{

    return new Promise((resolve,reject)=>{
        token = token.toUpperCase();



        let key = `${email}-resetPassword_Redis_Key`;
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

//check if token is valid
RedisGet(key)
.then((redis_token: any)=>{

    if(redis_token != null && redis_token === token){
        //token is valid
        //update password
        //delete token from redis
        //send email

        hashPassword(newpassword)
         
        .then((hashData: any)=>{
            let hash = hashData.data[0];
        UserModel.findOneAndUpdate({email}, {password: hash})
        .then((done: any)=>{
// change passwordTrial to 0

done.passwordTrial = 0
done.save()
.then((saved: any)=>{ console.log({saved}) })
.catch((savedError: any)=>{ console.log({savedError})  })



//send email
                let email_data: EmailData = {
                    detailType: "password_reset",  
                    subject: "Password Reset",
                     message: `Your password has been reset`,
                     type: "single-template",
                     template: "PASSWORD_RESET_SUCCESSFUL",
                    receiver: email,
                    data: {firstName: done.firstName, lastName: done.lastName}
                }

                sendEmail(email_data)
                .then((done: any)=>{

                    resolve({
                        data:[],
                        message:"password reset successful",
                        status:200,
                        statusCode:"PASSWORD_RESET_SUCCESSFUL"
                    })
                    return;

                })
                .catch((err: any)=>{

                    let error_log: ErrorDataType   = {
                        msg:`Error sending email. Error: ${err.message}` ,
                        status: "STRONG",
                        time:   new Date().toUTCString(),
                        stack:err.stack,
                        class: <string> <unknown>this
                    }
                
                    LogError(error_log)
                
                    reject({
                        data:[],
                        message:"password reset successful but email not sent",
                        status:500,
                        statusCode:"UNKNOWN_ERROR"
                    })
                    return;

                })

                
            //delete token from redis
            RedisDelete(`${email}-resetPassword_Redis_Key`)
            .then((done: any)=>{
console.log({info: `$email}-resetPassword_Redis_Key deleted from redis`})
})
            .catch((err: any)=>{
                let error_log: ErrorDataType   = {
                    msg:`Error deleting token from redis. Error: ${err.message}` ,
                    status: "STRONG",
                    time:   new Date().toUTCString(),
                    stack:err.stack,
                    class: <string> <unknown>this
                }
            
                LogError(error_log)
            
                reject({
                    data:[],
                    message:"unknown error",
                    status:500,
                    statusCode:"UNKNOWN_ERROR"
                })
                return;
            }
            )



}   )

        .catch((err: any)=>{
            let error_log: ErrorDataType   = {
                msg:`Error updating password. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }
        
            LogError(error_log)
        
            reject({
                data:[],
                message:"unknown error",
                status:500,
                statusCode:"UNKNOWN_ERROR"
            })
            return;
        }
        )

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
        stack:"password reset failed, please try again.",
        class: <string> <unknown>this
    }
    LogError(error_log);
   
                return;
    })






}
else{



    RedisSet(failedKey, failed+1)
    .then((failedCount: any)=>{})
    .catch((failedCountErr: any)=>{})



reject({
data:[],
message: redis_token==null? "token expired, please request new token. ":"invalid token",
status:400,
statusCode:"INVALID_TOKEN"
})
return;
}

})  

.catch((err: any)=>{
    let error_log: ErrorDataType   = {
        msg:`Error getting token from redis. Error: ${err.message}` ,
        status: "STRONG",
        time:   new Date().toUTCString(),
        stack:err.stack,
        class: <string> <unknown>this
    }

    LogError(error_log)

    reject({
        data:[],
        message:"unknown error",
        status:500,
        statusCode:"UNKNOWN_ERROR"
    })
    return;
}
)



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



public getUserLoginRecords(user_id:ObjectId, skip: number, timeStart: number, timeStop: number): Promise<RESPONSE_TYPE>{

    return new Promise((resolve,reject)=>{

if(timeStart != null && timeStop != null){
    //timeStart = 0;
   // timeStop = Date.now()
}

if(timeStart>timeStop || timeStop< timeStart){
    reject({
        data:[],
        message:"invalid time range",
        status:400,
        statusCode:"FORM_REQUIREMENT_ERROR"
    })
    return;
}
// console.log({$lte: timeStop, $gte: timeStart, skip})

        UserLoginRecord.find({user_id, time:{$lte: timeStop, $gte: timeStart}},null,{skip, limit: 200})
        .then((records: any)=>{

            if(records.length === 0){

                resolve({
                    data:[],
                    message:"no records found",
                    status:200,
                    statusCode:"LOGIN_RECORDS_NOT_FOUND"
                })
                return;

            }
            else{
                    
                    resolve({
                        data:records,
                        message:"records found",
                        status:200,
                        statusCode:"LOGIN_RECORDS_FOUND"
                    })
                    return;
    
            }
           

        })

        .catch((err: any)=>{
            let error_log: ErrorDataType   = {
                msg:`Error updating password. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }
        
            LogError(error_log)
        
            reject({
                data:[],
                message:"unknown error",
                status:500,
                statusCode:"UNKNOWN_ERROR"
            })
            return;
        }
        )

    })


}


public getAllUsersLoginRecords(skip: number, timeStart: number, timeStop: number): Promise<RESPONSE_TYPE>{

    return new Promise((resolve,reject)=>{

if(timeStart != null && timeStop != null){
   // timeStart = 0;
    // timeStop = Date.now()
}

if(timeStart>timeStop || timeStop< timeStart){
    reject({
        data:[],
        message:"invalid time range",
        status:400,
        statusCode:"FORM_REQUIREMENT_ERROR"
    })
    return;
}

        UserLoginRecord.find({ time:{$lte: timeStop, $gte: timeStart}},null,{skip, limit: 200})
        .then((records: any)=>{

            if(records.length === 0){

                resolve({
                    data:[],
                    message:"no records found",
                    status:200,
                    statusCode:"LOGIN_RECORDS_NOT_FOUND"
                })

                return;

            }
            else{
                    
                    resolve({
                        data:records,
                        message:"records found",
                        status:200,
                        statusCode:"LOGIN_RECORDS_FOUND"
                    })
                    return;
    
            }
           

        })

        .catch((err: any)=>{
            let error_log: ErrorDataType   = {
                msg:`Error updating password. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }
        
            LogError(error_log)
        
            reject({
                data:[],
                message:"unknown error",
                status:500,
                statusCode:"UNKNOWN_ERROR"
            })
            return;
        }
        )


    })


}





public isUserLoggedIn(user_id:ObjectId, token: string): Promise<RESPONSE_TYPE>{

    return new Promise((resolve,reject)=>{
 
        UserLoginRecord.findOne( {user_id,token, status:"ACTIVE"  } , null)
        .then((records: any)=>{
 
            
            if(records === null){

                reject({
                    data:[],
                    message:"user is not currently logged in",
                    status:200,
                    statusCode:"LOGIN_FAILED"
                })
                return;

            }
            else{
                    


                    resolve({
                        data:records,
                        message:"user is logged in",
                        status:200,
                        statusCode:"LOGIN_SUCCESSFUL"
                    })
                    return;
    
            }
           

        })

        .catch((err: any)=>{
            let error_log: ErrorDataType   = {
                msg:`Error updating password. Error: ${err.message}` ,
                status: "STRONG",
                time:   new Date().toUTCString(),
                stack:err.stack,
                class: <string> <unknown>this
            }
        
            LogError(error_log)
        
            reject({
                data:[],
                message:"unknown error",
                status:500,
                statusCode:"UNKNOWN_ERROR"
            })
            return;
        }
        )


    })


}

}
export const AuthLogin = new AuthLoginClass();