/*
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


*/