//login
//logout
//reset password
 
import { EmailData, LoginData, RESPONSE_TYPE, TokenPayload } from "../helpers/customTypes";
import { UserLoginRecord, UserModel } from "../databases/external";
import { ErrorDataType, LogError } from "../helpers/errorReporting";
import { createJwtToken, generateRandomString, verifyPassword } from "../helpers/misc";
import { RedisDelete, RedisSet, RedisGet } from "../helpers/redis";
import { sendEmail } from "../helpers/mail";
import { ObjectId } from "mongoose";




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

UserModel.findOne({filter})
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


        if(user.status != "ACTIVE"){

            reject({data: [], message: "account not active, please contact admin", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
            return;
             }
            
             if(user.emailVerified != true && user.phoneNumVerified != true){
            reject({data: [], message: "account not verified, please verify your account", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
            return; 
            }
            
            
             if(user.deleted == true){
            reject({data: [], message: "user not found, account deleted", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
            return;
             }
            


             verifyPassword(password, user.password)
.then((Match: RESPONSE_TYPE)=>{
    let isMatch: boolean = Match.statusCode== "SUCCESS" ? true : false;
    if(isMatch){
        //login successful

   
// generate token
   

                let tokenpayload :TokenPayload = {

                    id: user._id,
                    email: user.email,
                    time: Date.now()
                }

                createJwtToken(tokenpayload )
                .then((token: string)=>{

// save login info
UserLoginRecord.updateMany({user_id: user._id, token}, {status: "INACTIVE"})
.then((done: any)=>{

  
    UserLoginRecord.create({
        user_id: user._id,email: user.email, token, status: "ACTIVE"})

        .then((done: any)=>{ 

            resolve({
                data:[{token}],
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


                if(user.status != "ACTIVE"){

                    reject({data: [], message: "account not active, please contact admin", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                    return;
                     }
                    
                     if(user.emailVerified != true && user.phoneNumVerified != true){
                    reject({data: [], message: "account not verified, please verify your account", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                    return; 
                    }
                    
                    
                     if(user.deleted == true){
                    reject({data: [], message: "user not found, account deleted", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                    return;
                     }
                    


                generateRandomString(6)
                .then((token: RESPONSE_TYPE)=>{
                    //save token
                    let resettoken = token.data[0] as string;

                    //save to redis
                    RedisSet(`${email}-resetPassword_Redis_Key`, resettoken)
                    .then((done: any)=>{

                        //send email

                        let email_data: EmailData = {
                            detailType: "password_reset",  
                            subject: "Password Reset",
                             message: `Your password reset token is ${resettoken}`,
                             type: "single-template",

                            template: "PASSWORD_RESET_TOKEN",
                            receiver: email
                        }

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
    
        //check if token is valid
        RedisGet(`${email}-resetPassword_Redis_Key`)
        .then((redis_token: any)=>{

            if(redis_token != null && redis_token === token){
                //token is valid
                //update password
                //delete token from redis
                //send email

                UserModel.findOneAndUpdate({email}, {password: newpassword})
                .then((done: any)=>{
 //send email
                        let email_data: EmailData = {
                            detailType: "password_reset",  
                            subject: "Password Reset",
                             message: `Your password has been reset`,
                             type: "single-template",
                             template: "PASSWORD_RESET_SUCCESSFUL",
                            receiver: email
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


}
else{

    reject({
        data:[],
        message:"invalid token",
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

    })

}



public getUserLoginRecords(user_id:ObjectId, skip: number, timeStart: number, timeStop: number): Promise<RESPONSE_TYPE>{

    return new Promise((resolve,reject)=>{

if(timeStart != null && timeStop != null){
    timeStart = 0;
    timeStop = Date.now()
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

    })


}


public getAllUsersLoginRecords(skip: number, timeStart: number, timeStop: number): Promise<RESPONSE_TYPE>{

    return new Promise((resolve,reject)=>{

if(timeStart != null && timeStop != null){
    timeStart = 0;
    timeStop = Date.now()
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

    })


}


}
export const AuthLogin = new AuthLoginClass();