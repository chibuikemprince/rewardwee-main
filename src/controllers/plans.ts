import { ObjectId } from "mongoose";
import { AllSubscriptionPlans } from "../databases/external";
import { RESPONSE_TYPE } from "../helpers/customTypes";
import { ErrorDataType, LogError } from "../helpers/errorReporting"; 



export const getPlanInfo = (plan_id: ObjectId) : Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject :any) => {

AllSubscriptionPlans.findOne({_id : plan_id})
.then((plan : any) => {

let response : RESPONSE_TYPE = { 
    status : 200,
    data: [plan],
    message:"plan data fetched successfully",
    statusCode: "SUCCESS"
}


resolve(response)
return;

})
.catch((err : any) => {

    let response : RESPONSE_TYPE = {
        status : 500,
        data: [],
        message: "error occurred, please try again",
        statusCode: "UNKNOWN_ERROR"
    }

    let error_log: ErrorDataType = {
        msg: err.message,
        stack: err.stack,
        status: "MILD",
        time: new Date().toISOString(),
        class: "getPlanInfo"
    }
    
    reject(response)
    LogError(error_log)
    return;

    
})



    
})

}


