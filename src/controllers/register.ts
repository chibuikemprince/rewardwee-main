import { EmailData, RESPONSE_TYPE, RegData } from "../helpers/customTypes"
import { ErrorDataType, LogError } from "../helpers/errorReporting";
import UserModel from "../../../rewardwee_database/auth/users"


import { generateRandomString, hashPassword } from "../helpers/misc";
import { Redis } from "ioredis";
import { set } from "../helpers/redis";
import { sendOtp } from "../helpers/otp";
export const formReg = (data: RegData): Promise<RESPONSE_TYPE> => {

return new Promise((resolve: any, reject: any)=>{


    const {email, password, company, first_name, last_name } = data;


  //  email, password, company and firstname must be set.

    if(!email || !password || !company || !first_name ){
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
            UserModel.create({email, first_name, last_name, company, password : hash})
            .then((newUser: any)=>{

/* Redis.set(newUser._id, newUser, (err: any) => {
    if (err) {
        reject(false);  
        let error : ErrorDataType = {
            msg:err.msg,
            status: "STRONG",
            time:   new Date().toUTCString(),
            stack:err.stack,
            class: <string> <unknown>this
        }

LogError(error);
        return;
    }
    else{
        console.log("user saved to redis")
    }
}) */
 generateRandomString(10)
            .then((otp_data: RESPONSE_TYPE)=>{
                let otp = otp_data.data[0];

                let emailData: EmailData = {
                   message: `Your otp is ${otp}`,
                   receiver: email,
                   subject: "Otp for account activation",
                   template: "ACCOUNT_ACTIVATION"
                }
               sendOtp(otp)
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
 

            })
            //


                



                let done: RESPONSE_TYPE = {
                    data: [newUser],
                    message: "Account created successfully, kindly activate your account with the link sent to your email.",
                    status: 200,
                    statusCode: "SUCCESS"
                     }
                        resolve(done);
                        return;
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
        var salt = bcryptjs.genSaltSync(10)
        var hash = bcryptjs.hashSync(password, salt)
        console.log("creating new user")
        await UserModel.create({_id : userId  ,email, first_name, last_name, company, password : hash})
        
        const token = createJwtToken({email, id: userId})

        console.log("sending verification email")
        
        const verificationSent = await sendVerificationEmail(email, first_name, token)
        console.log("user created successfully")
        res.status(200).send({
            message : 'Signup Successfully',
            verificationSent
        })
    }

       

    } 

})
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