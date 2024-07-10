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
teamName = teamName.toLowerCase();

TeamsModel.findOne({ name: teamName,
  user_id: userId})
  .then((exist: any)=>{
if(exist){

  let error: RESPONSE_TYPE = {
    data:[],
    message: "Team already exist.",
    status: 409,
    statusCode: "RESOURCE_ALREADY_EXIST"
}
reject(error)
return;
}
else{

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


  })
  .catch((err: any)=>{


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
    
 // Check if a team exists
 getATeam(teamId: ObjectId): Promise<RESPONSE_TYPE> {
  return new Promise((resolve, reject) => {
    TeamsModel.findById({_id:teamId})
      .then((team) => {
        if (team) {
          const response: RESPONSE_TYPE = {
            data: [team],
            message: "Team exists",
            status: 200,
            statusCode: "SUCCESS"
          };
          resolve(response);
          return;

        } else {
          const response: RESPONSE_TYPE = {
            data: [],
            message: "Team does not exist",
            status: 404,
            statusCode: "RESOURCE_NOT_FOUND"
          };
          resolve(response);
          return;

        }
      })
      .catch((err) => {
        const error: RESPONSE_TYPE = {
          data: [],
          message: "Failed to check team existence",
          status: 500,
          statusCode: "UNKNOWN_ERROR"
        };
        reject(error);
        return;
      });
  });
}

getATeamByName(name: string): Promise<RESPONSE_TYPE> {
  return new Promise((resolve, reject) => {
    TeamsModel.find({name})
      .then((team) => {
        if (team.length>0) {
          const response: RESPONSE_TYPE = {
            data: team,
            message: "Team exists",
            status: 200,
            statusCode: "SUCCESS"
          };
          resolve(response);
          return;

        } else {
          const response: RESPONSE_TYPE = {
            data: [],
            message: "Team does not exist",
            status: 404,
            statusCode: "RESOURCE_NOT_FOUND"
          };
          resolve(response);
          return;

        }
      })
      .catch((err) => {
        const error: RESPONSE_TYPE = {
          data: [],
          message: "Failed to check team existence",
          status: 500,
          statusCode: "UNKNOWN_ERROR"
        };
        reject(error);
        return;
      });
  });
}


     // Update team information
     updateTeam(teamId: ObjectId, newTeamInfo: TeamUpdate): Promise<RESPONSE_TYPE>  {
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


            TeamsModel.updateOne({_id: teamId}, newTeamInfo)
            .then((data: any)=>{
            let response: RESPONSE_TYPE = {
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
            let error :  RESPONSE_TYPE = {
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
      fetchTeamsByUser(userId: ObjectId, page: number =1): Promise<RESPONSE_TYPE>  {
        return new Promise((resolve, reject) => {
          try {
            // Your code to fetch teams by user goes here
            // You can use the provided userId
            // Resolve the promise with a success response
            const perPage = 100;
            const currentPage = page || 1;
            TeamsModel.find({user_id: userId} )
            .populate({
              path: 'user_id',
              select: '-isEmailVerified -isPhoneNumberVerified -regDate -password -skills -status -deleted -kycVerification -createdAt -updatedAt -__v -emailVerifiedAt -passwordTrial'
            })
            .skip((currentPage - 1) * perPage)
        .limit(perPage)
            .then((data: any)=>{
                let response :  RESPONSE_TYPE= {
                    data,
                    message: "Teams fetched successfully",
                    status: 200,
                    statusCode: "SUCCESS"
                  };
                  resolve(response);
                  return;
            })
            .catch((err: any)=>{


                let error :  RESPONSE_TYPE= {
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
            let error:  RESPONSE_TYPE = {
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
      deleteTeam(teamId: ObjectId, userId: ObjectId) : Promise<RESPONSE_TYPE> {
        return new Promise((resolve, reject) => {
       

try{
          
          TeamsModel.deleteOne({_id: teamId, user_id: userId}  )
          .then((data)=>{
              let response :  RESPONSE_TYPE= {
                  data: [],
                  message: "Teams deleted successfully",
                  status: 200,
                  statusCode: "SUCCESS"
                };
                resolve(response);
                return;
          })
          .catch((err: any)=>{


              let error:  RESPONSE_TYPE = {
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
    let error:  RESPONSE_TYPE = {
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
  
  
  export default new TeamModule();