//get a user profile
// get all registered users, filter company, team, status, regDate
// update profile
// delete profile
// change password

import { EmailData, FilterUsers, GeneralObject, PasswordUpdateData, RESPONSE_TYPE, profileUpdateData } from "../helpers/customTypes";
import { ErrorDataType, LogError } from "../helpers/errorReporting";
import { sendEmail } from "../helpers/mail";
import { hashPassword, verifyPassword } from "../helpers/misc";
import { UserModel } from "../databases/external";
import { ObjectId } from "mongoose";
import {AuthLogin} from "../controllers/login";

class UserProfile {

    constructor() {

        console.log("user profile constructor called");

    }


    public async getProfile(user_id: ObjectId) : Promise<RESPONSE_TYPE> {

        return new Promise((resolve, reject) => {

            try {
UserModel.findOne({ _id: user_id}, { _id: 1, email: 1, company: 1, team: 1, firstName: 1, lastName: 1, status: 1, regDate: 1 })
                .then((user: any) => {

                    if (user != null) {
// return user profile
console.log({user})
/* 
// all this verification should be handle by login script
 if(user.status.toUpperCase()  != "ACTIVE"){

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

 */
let response: RESPONSE_TYPE = {
    data: [user],
    message: "user profile retrieved successfully",
    status: 200,
    statusCode: "SUCCESS"
}

resolve(response);
return;




                    }
                    else{
//user not found
let error_type: RESPONSE_TYPE = {
    data: [],
    message: "user not found",
    status: 404,
    statusCode: "RESOURCE_NOT_FOUND"
}
reject(error_type);
return;


                    }
                })
                .catch((err: any) => {
                
                    let error: ErrorDataType = {
                    
                        status: "STRONG",
                        msg: `Redis client is not connected. Error: ${err.message}`,
                        class: "UserProfile",
                        time: new Date().toISOString(),
                        stack: err.stack

                    
                    }

                    LogError(error);

                    let error_type: RESPONSE_TYPE = {
                        data: [],
                        message: "unknown error occurred, please try again.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    }

                    reject(error_type);
                    return;


                })

                

            } catch (err: any) {
 
                let error: ErrorDataType = {

                    status: "STRONG",
                    msg: `Redis client is not connected. Error: ${err.message}`,
                    class: "RedisClient",
                    time: new Date().toISOString()

                }

                LogError(error);

                let error_type: RESPONSE_TYPE = {
                    data: [],
                    message: "unknown error occurred, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                }
                reject(error_type);
                return;


            }

        })


    }


    public async getAllProfiles(skip: number) : Promise<RESPONSE_TYPE>{


        return new Promise((resolve, reject) => {

            try {

                UserModel.find({deleted: false}, { _id: 1, email: 1, company: 1, team: 1, firstName: 1, lastName: 1, status: 1, regDate: 1 }, { sort: { regDate: -1 }, skip, limit: 200})
                    .then((users: any) => {

                        if (users.length > 0) {

                             

                            let response: RESPONSE_TYPE = {
                                data: users,
                                message: "user profiles retrieved successfully",
                                status: 200,
                                statusCode: "SUCCESS"
                            }

                        }
                        else {

                            let error_type: RESPONSE_TYPE = {
                                data: [],
                                message: "no users found",
                                status: 404,
                                statusCode: "RESOURCE_NOT_FOUND"
                            }

                            reject(error_type);
                            return;

                        }
                    })
                    .catch((err: any) => {

                        let error: ErrorDataType = {
                            msg: `Error getting all profiles. Error: ${err.message}`,
                            status: "STRONG",
                            time: new Date().toISOString(),
                            stack: err.stack,
                            class: "UserProfile"
                        }

                        LogError(error);

                        let error_type: RESPONSE_TYPE = {
                            data: [],
                            message: "unknown error occurred, please try again.",
                            status: 500,
                            statusCode: "UNKNOWN_ERROR"
                        }

                        reject(error_type);
                        return;
                    })

            } catch (err: any) {

                let error: ErrorDataType = {
                msg: `Error getting all profiles. Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toISOString(),
                stack: err.stack,
                class: "UserProfile"

                }

                LogError(error);

                let error_type: RESPONSE_TYPE = {
                    data: [],
                    message: "unknown error occurred, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"

                }

                reject(error_type);
                return;

            }

    })

}


public filterUsers(filter: FilterUsers, skip: number): Promise<RESPONSE_TYPE>{

    return new Promise((resolve, reject) => {
 
        try {
 /* email = email.toLowerCase()
team = team.toLowerCase()
firstName = firstName.toLowerCase()
lastName = lastName.toLowerCase() */

if(filter.email && filter.email!= ""){
     	filter.email = filter.email.toLowerCase()
    }
    if(filter.team && filter.team!= ""){ 	filter.team = filter.team.toLowerCase() }
    if(filter.firstName && filter.firstName!= ""){ 	filter.firstName = filter.firstName.toLowerCase()}
    if(filter.lastName && filter.lastName!= ""){ 	filter.lastName = filter.lastName.toLowerCase() }


    if(filter.company && filter.company!= ""){
filter.company = filter.company.toLowerCase()
    }



if(filter.hasOwnProperty("regDate_from")){

    filter.regDate = { $gte: filter.regDate_from, $lte: filter.regDate_to };
    delete filter.regDate_from;
    delete filter.regDate_to;

}
UserModel.find(filter, { _id: 1, email: 1, company: 1, team: 1, firstName: 1, lastName: 1, status: 1, regDate: 1 }, { sort: { regDate: -1 }, skip, limit: 200 })
.then( (users: any) => {           
    if(users.length > 0){

        let response: RESPONSE_TYPE = {
            data: users,
            message: "user profiles retrieved successfully",
            status: 200,
            statusCode: "SUCCESS"
        }

        resolve(response);
        return;

    }
    else{

        let error_type: RESPONSE_TYPE = {
            data: [],
            message: "no users found",
            status: 404,
            statusCode: "RESOURCE_NOT_FOUND"
        }

        reject(error_type);
        return;

    }



})


        }
        catch(err: any){

            let error: ErrorDataType = {
                msg: `Error getting all profiles. Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toISOString(),
                stack: err.stack,
                class: "UserProfile"

            }

            LogError(error);

            let error_type: RESPONSE_TYPE = {
                data: [],
                message: "unknown error occurred, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"

            }

            reject(error_type);
            return;
        }

    })

    
}

//update profile
public updateProfile(user_id: ObjectId, update: profileUpdateData) : Promise<RESPONSE_TYPE>{

    return new Promise((resolve, reject) => {

try{
// remove any empty or null properties from the update object
let new_update: GeneralObject = update;
let length: number = Object.keys(new_update).length;
if(length==0){
    let emptyUpdateDataError: RESPONSE_TYPE = {
        data: [],
        message: "update data cannot be empty",
        status: 400,
        statusCode: "FORM_REQUIREMENT_ERROR"
    }

    reject(emptyUpdateDataError);
    return;
}

let count: number = 0;
for(let key in new_update){


if(key == "password"){
    delete new_update[key]
}


if(key in ["email", "firstName", "lastName", "company", "team"]){
    new_update[key] = new_update[key].toString().toLowerCase();

}
    if(new_update[key] === null || new_update[key] === undefined || new_update[key] === ""){
        reject({
            data: [],
            message: `invalid update data, ${key} cannot be empty or null`,
            status: 400,
            statusCode: "BAD_REQUEST"

        })
        return;
    }
    
count++; 

if(count === length){

    
UserModel.updateOne({_id: user_id}, new_update)
.then((result: any) => {

    if(result.modifiedCount > 0){

        let response: RESPONSE_TYPE = {
            data: [],
            message: "user profile updated successfully",
            status: 200,
            statusCode: "SUCCESS"
        }

        resolve(response);
        return;

    }
    else{

        let error_type: RESPONSE_TYPE = {
            data: [],
            message: "user profile not updated",
            status: 404,
            statusCode: "RESOURCE_NOT_FOUND"
        }

        reject(error_type);
        return;

    }

})
.catch((err: any) => {
    
        let error: ErrorDataType = {
            msg: `Error updating profile. Error: ${err.message}`,
            status: "STRONG",
            time: new Date().toISOString(),
            stack: err.stack,
            class: "UserProfile"
    
        }
    
        LogError(error);
    
        let error_type: RESPONSE_TYPE = {
            data: [],
            message: "unknown error occurred, please try again.",
            status: 500,
            statusCode: "UNKNOWN_ERROR"
    
        }
    
        reject(error_type);
        return;
    
})

}


}


}
catch(err: any){

    let error: ErrorDataType = {
        msg: `Error updating profile. Error: ${err.message}`,
        status: "STRONG",
        time: new Date().toISOString(),
        stack: err.stack,
        class: "UserProfile"

    }

    LogError(error);

    let error_type: RESPONSE_TYPE = {
        data: [],
        message: "unknown error occurred, please try again.",
        status: 500,
        statusCode: "UNKNOWN_ERROR"

    }

    reject(error_type);
    return;

}
    
    
    })
} 


public updatePassword(user_id: ObjectId, data: PasswordUpdateData) : Promise<RESPONSE_TYPE>{

    return new Promise((resolve, reject) => {

        try{

            UserModel.findOne({_id: user_id})
            .then((user: any) => {

                if(user){

                    verifyPassword(data.oldPassword, user.password)

                    .then((result: RESPONSE_TYPE) => {

                        if(result.statusCode === "SUCCESS"){

                            hashPassword(data.newPassword)
                            .then((hash: RESPONSE_TYPE) => {

                                UserModel.updateOne({_id: user_id}, {password: hash.data[0]})
                                .then((result: any) => {

                                    if(result.modifiedCount > 0){

//send email to user
let email_data: EmailData = {
detailType: "password_update",
message: "Your password has been updated successfully",
subject: "Password Update",
receiver: user.email,
type: "single-template",
template: "CHANGE_PASSWORD",

    }

sendEmail(email_data)
.then((result: any) => {
    
        if(result.statusCode === "SUCCESS"){
    
            let response: RESPONSE_TYPE = {
                data: [],
                message: "user password updated successfully",
                status: 200,
                statusCode: "SUCCESS"
            }
    
            resolve(response);
            return;
    
        }
        else{
    
            let error_type: RESPONSE_TYPE = {
                data: [],
                message: "user password updated successfully, but email notification not sent",
                status: 200,
                statusCode: "SUCCESS"
            }
    
            reject(error_type);
            return;
    
        }
    
})
.catch((err: any) => {

    let error: ErrorDataType = {
        msg: `Error sending email. Error: ${err.message}`,
        status: "STRONG",
        time: new Date().toISOString(),
        stack: err.stack,
        class: "UserProfile"

    }

    LogError(error);

    let error_type: RESPONSE_TYPE = {
        data: [],
        message: "user password updated successfully, but email notification not sent",
        status: 200,
        statusCode: "SUCCESS"
    }

    reject(error_type);
    return;


})


                                    }
                                    else{

                                        let error_type: RESPONSE_TYPE = {
                                            data: [],
                                            message: "user password not updated",
                                            status: 404,
                                            statusCode: "RESOURCE_NOT_FOUND"
                                        }
                                
                                        reject(error_type);
                                        return;

                                    }

                                })
                                .catch((err: any) => {

                                    let error: ErrorDataType = {
                                        msg: `Error updating password. Error: ${err.message}`,
                                        status: "STRONG",
                                        time: new Date().toISOString(),
                                        stack: err.stack,
                                        class: "UserProfile"
                                
                                    }
                                
                                    LogError(error);
                                
                                    let error_type: RESPONSE_TYPE = {
                                        data: [],
                                        message: "unknown error occurred, please try again.",
                                        status: 500,
                                        statusCode: "UNKNOWN_ERROR"
                                
                                    }
                                
                                    reject(error_type);
                                    return;

                                })

                            })
                            .catch((err: any) => {

                                let error: ErrorDataType = {
                                    msg: `Error updating password. Error: ${err.message}`,
                                    status: "STRONG",
                                    time: new Date().toISOString(),
                                    stack: err.stack,
                                    class: "UserProfile"
                            
                                }
                            
                                LogError(error);
                            
                                let error_type: RESPONSE_TYPE = {
                                    data: [],
                                    message: "unknown error occurred, please try again.",
                                    status: 500,
                                    statusCode: "UNKNOWN_ERROR"
                            
                                }
                            
                                reject(error_type);
                                return;

                            })

                        }
                        else{

                            let error_type: RESPONSE_TYPE = {
                                data: [],
                                message: "incorrect current password",
                                status: 400,
                                statusCode: "BAD_REQUEST"
                            }
                    
                            reject(error_type);
                            return;

                        }

    })
    .catch((err: any) => {

        let error: ErrorDataType = {
            msg: `Error updating password. Error: ${err.message}`,
            status: "STRONG",
            time: new Date().toISOString(),
            stack: err.stack,
            class: "UserProfile"
    
        }
    
        LogError(error);
    
        let error_type: RESPONSE_TYPE = {
            data: [],
            message: "unknown error occurred, please enter a valid current password.",
            status: 500,
            statusCode: "UNKNOWN_ERROR"
    
        }
    
        reject(error_type);
        return;



    })


} 
else{   

    let error_type: RESPONSE_TYPE = {
        data: [],
        message: "account not found, please login to continue",
        status: 404,
        statusCode: "RESOURCE_NOT_FOUND"
    }

    reject(error_type);
    return;



}
            })
            .catch((err: any) => {

                let error: ErrorDataType = {
                    msg: `Error updating password. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toISOString(),
                    stack: err.stack,
                    class: "UserProfile"
            
                }
            
                LogError(error);
            
                let error_type: RESPONSE_TYPE = {
                    data: [],
                    message: "unknown error occurred, please ensure you are logged in.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
            
                }
            
                reject(error_type);
                return;
            })
        }
        catch(err: any){

            let error: ErrorDataType = {
                msg: `Error updating password. Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toISOString(),
                stack: err.stack,
                class: "UserProfile"
        
            }
        
            LogError(error);
        
            let error_type: RESPONSE_TYPE = {
                data: [],
                message: "unknown error occurred, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
        
            }
        
            reject(error_type);
            return;


        }


    })

}


public DeleteAccount(user_id: ObjectId, token: string) : Promise<RESPONSE_TYPE>{

    return new Promise((resolve, reject) => {

        try{

            UserModel.findOne({_id: user_id})
            .then((user: any) => {

                if(user){

                    UserModel.updateOne({_id: user_id}, {deleted: true, deleted_at: Date.now()})
                    .then((result: any) => {

                        if(result.modifiedCount > 0){

                            // logout user account

                            AuthLogin.logout(token)
                            .then((outDone: any)=>{})
                            .catch((outDoneErr: any)=>{})

                            let response: RESPONSE_TYPE = {
                                data: [],
                                message: "user account deleted successfully",
                                status: 200,
                                statusCode: "SUCCESS"
                            }
                    
                            resolve(response);
                            return;

                        }
                        else{

                            let error_type: RESPONSE_TYPE = {
                                data: [],
                                message: "user account not deleted",
                                status: 404,
                                statusCode: "RESOURCE_NOT_FOUND"
                            }
                    
                            reject(error_type);
                            return;

                        }

                    })
                    .catch((err: any) => {

                        let error: ErrorDataType = {
                            msg: `Error deleting user account. Error: ${err.message}`,
                            status: "STRONG",
                            time: new Date().toISOString(),
                            stack: err.stack,
                            class: "UserProfile"
                    
                        }
                    
                        LogError(error);
                    
                        let error_type: RESPONSE_TYPE = {
                            data: [],
                            message: "unknown error occurred, please try again.",
                            status: 500,
                            statusCode: "UNKNOWN_ERROR"
                    
                        }
                    
                        reject(error_type);
                        return;

                    })

                }
                else{

                    let error_type: RESPONSE_TYPE = {
                        data: [],
                        message: "account not found, please login to continue",
                        status: 404,
                        statusCode: "RESOURCE_NOT_FOUND"
                    }
            
                    reject(error_type);
                    return;

                }

            })
            .catch((err: any) => {

                let error: ErrorDataType = {
                    msg: `Error deleting user account. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toISOString(),
                    stack: err.stack,
                    class: "UserProfile"
            
                }
            
                LogError(error);
            
                let error_type: RESPONSE_TYPE = {
                    data: [],
                    message: "unknown error occurred, please ensure you are logged in.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
            
                }
            
                reject(error_type);
                return;

            })

        }
        catch(err: any){

        }

    })

}


}

export default new UserProfile()
