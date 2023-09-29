import { ObjectId } from "mongoose";
import { TeamsModel } from "../databases/external";
import { RESPONSE_TYPE } from "../helpers/customTypes";
import { ErrorDataType, LogError } from "../helpers/errorReporting";
import {TeamUpdate} from "./types/index"


class TeamModule {
    // Create a new team
    createTeam(teamName: string, userId: ObjectId, description: string = '')
    : Promise<RESPONSE_TYPE> {
      return new Promise((resolve, reject) => {
try {
        if(teamName.length==0){
            let error: RESPONSE_TYPE = {
                data:[],
                message: "Team name is required",
                status: 400,
                statusCode: "FORM_REQUIREMENT_ERROR"
            }
            reject(error)
        return;
        }


TeamsModel.create({
    name: teamName,
    description: description,
    user_id: userId
})
.then((data)=>{ 

    let response: RESPONSE_TYPE = { 

        data: [],
        message: "Team created successfully",
        status: 200,
        statusCode: "SUCCESS"
    
    }

    resolve(response );
    return;

})
.catch((err)=>{
    let error: RESPONSE_TYPE = {
        data:[],
        message: "Team creation failed",
        status: 400,
        statusCode: "UNKNOWN_ERROR"
    }
    reject(error)
    let err_found: ErrorDataType = {
        msg:` ${err.message}` ,
        status: "STRONG",
        time:   new Date().toUTCString(),
        stack:err.stack,
        class: <string> <unknown>this
  
  
    }
  
  
    LogError(err_found);
    return;
})

      }
          
catch(err: any){
    let error: RESPONSE_TYPE = {
        data: [],
        message: "Failed to update job data.",
        status: 500,
        statusCode: "UNKNOWN_ERROR"
    };
    reject(error);
  
    let err_found: ErrorDataType = {
        msg:` ${err.message}` ,
        status: "STRONG",
        time:   new Date().toUTCString(),
        stack:err.stack,
        class: <string> <unknown>this
  
  
    }
  
  
    LogError(err_found);
    return;
  }
   



      });
    }
    



     // Update team information
     updateTeam(teamId: ObjectId, newTeamInfo: TeamUpdate) {
        return new Promise((resolve, reject) => {
          try {
            // Your code to update team information goes here
            // You can use the provided teamId and newTeamInfo
            // Resolve the promise with a success response


            // if newTeamInfo is empty , throw error
            if(newTeamInfo.hasOwnProperty("name") ){

if(newTeamInfo.name == undefined ||newTeamInfo.name.length==0){
let error: RESPONSE_TYPE = {
                    data:[],
                    message: "Team name cannot be empty",
                    status: 400,
                    statusCode: "FORM_REQUIREMENT_ERROR"
                }
                reject(error)
                return;
}

                
            } 


            TeamsModel.updateOne({_id: teamId}, {$set: newTeamInfo})
            .then((data)=>{
            let response = {
              data: [],
              message: "Team updated successfully",
              status: 200,
              statusCode: "SUCCESS"
            };
            resolve(response);
            return;
        
        } )

            .catch((err: any)=>{

                let error: RESPONSE_TYPE = {
                    data:[],
                    message: "Team update failed",
                    status: 400,
                    statusCode: "UNKNOWN_ERROR"
                }
                reject(error)
                let err_found: ErrorDataType = {
                    msg:` ${err.message}` ,
                    status: "STRONG",
                    time:   new Date().toUTCString(),
                    stack:err.stack,
                    class: <string> <unknown>this
                
                
                }
                
                
                LogError(err_found);
                return;
            
            })
 
          } catch (err: any) {
            // Handle any unexpected error during team update
            let error = {
              data: [],
              message: "Failed to update team",
              status: 500,
              statusCode: "UNKNOWN_ERROR"
            };
            reject(error);

            let err_found: ErrorDataType = {
              msg: `${err.message}`,
              status: "STRONG",
              time: new Date().toUTCString(),
              stack: err.stack,
              class: <string><unknown>this
            };
            LogError(err_found);
            return;


          }
        });
      }
    
      // Fetch teams created by a user
      fetchTeamsByUser(userId: ObjectId) {
        return new Promise((resolve, reject) => {
          try {
            // Your code to fetch teams by user goes here
            // You can use the provided userId
            // Resolve the promise with a success response

            TeamsModel.find({user_id: userId} )
            .then((data)=>{
                let response = {
                    data,
                    message: "Teams fetched successfully",
                    status: 200,
                    statusCode: "SUCCESS"
                  };
                  resolve(response);
                  return;
            })
            .catch((err: any)=>{


                let error = {
                    data: [],
                    message: "Failed to fetch teams",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                  };
                  reject(error);
                  let err_found: ErrorDataType = {
                    msg: `${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack,
                    class: <string><unknown>this
                  };
                  LogError(err_found);
                  return;


            })

        






          } catch (err: any) {
            // Handle any unexpected error during team fetch
            let error = {
              data: [],
              message: "Failed to fetch teams",
              status: 500,
              statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            let err_found: ErrorDataType = {
              msg: `${err.message}`,
              status: "STRONG",
              time: new Date().toUTCString(),
              stack: err.stack,
              class: <string><unknown>this
            };
            LogError(err_found);
            return;
          }
        });
      }
    
      // Delete a team
      deleteTeam(teamId: ObjectId) {
        return new Promise((resolve, reject) => {
         /* 
            try {
            // Your code to delete a team goes here
            // You can use the provided teamId
            // Resolve the promise with a success response
            let response = {
              data: [],
              message: "Team deleted successfully",
              status: 200,
              statusCode: "SUCCESS"
            };
            resolve(response);
          } 
          
          catch (err) {
            // Handle any unexpected error during team deletion
            let error = {
              data: [],
              message: "Failed to delete team",
              status: 500,
              statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            let err_found = {
              msg: `${err.message}`,
              status: "STRONG",
              time: new Date().toUTCString(),
              stack: err.stack,
              class: <string><unknown>this
            };
            LogError(err_found);
          }

 */

try{
          
          TeamsModel.deleteOne({_id: teamId}  )
          .then((data)=>{
              let response = {
                  data,
                  message: "Teams deleted successfully",
                  status: 200,
                  statusCode: "SUCCESS"
                };
                resolve(response);
                return;
          })
          .catch((err: any)=>{


              let error = {
                  data: [],
                  message: "Failed to delete teams",
                  status: 500,
                  statusCode: "UNKNOWN_ERROR"
                };
                reject(error);
                let err_found: ErrorDataType = {
                  msg: `${err.message}`,
                  status: "STRONG",
                  time: new Date().toUTCString(),
                  stack: err.stack,
                  class: <string><unknown>this
                };
                LogError(err_found);
                return;


          })

}
catch (err: any) {
    // Handle any unexpected error during team fetch
    let error = {
      data: [],
      message: "Failed to fetch teams",
      status: 500,
      statusCode: "UNKNOWN_ERROR"
    };
    reject(error);
    let err_found: ErrorDataType = {
      msg: `${err.message}`,
      status: "STRONG",
      time: new Date().toUTCString(),
      stack: err.stack,
      class: <string><unknown>this
    };
    LogError(err_found);
    return;
  }
        });


        
      }



  }
  
  module.exports = TeamModule;