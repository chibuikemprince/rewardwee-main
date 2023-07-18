
import { ObjectId } from "mongoose";
import { AllSubscriptionPlans } from "../databases/external";

import { SubscriptionPlanUpdateType } from "../helpers/customTypes";
import { CurrencyType, CurrencyArray, SubscriptionPlanType } from "../modules/types";

import { RESPONSE_TYPE } from "../helpers/customTypes";
import { ErrorDataType, LogError } from "../helpers/errorReporting";


class SubscriptionPlanModule {


constructor(){
    
}

    /**
     * This method is used to create a new subscription plan. 
     * It checks if all required fields are present and not null. If the plan data is valid, 
     * it creates a new subscription plan in the database and returns a success message. 
     * If there's an error during the process, it logs the error and returns an error message. 
     * 
     * @param plan 
     * 
     * @returns 
     */
      createPlan(plan: SubscriptionPlanType): Promise<RESPONSE_TYPE> {
        return new Promise( (resolve:any, reject: any) => {
 
try{

            // check that plan data contains all required fields in SubscriptionPlanType and non is null
            if (plan.name 
                && plan.name.length
                && plan.adminId 
                 
                && plan.duration 
                && plan.duration>0 
                && plan.price 
                 
                && plan.currency
                && plan.currency in CurrencyArray
                
                ) {


                AllSubscriptionPlans.create(plan)
                    .then( (createdPlan: SubscriptionPlanType) => {
                       
                       let res :RESPONSE_TYPE = {
                            status: 200,
                            message: "Plan created successfully",
                            data: [],
                            statusCode: "PLAN_CREATED"
                        }
                        resolve(res)
                        return;

                    })
                    .catch( (err: any) => {

                         let error_log: ErrorDataType = {
                            msg:`Error occurred. Error: ${err.message}` ,
                            status: "MILD",
                            time:   new Date().toUTCString(),
                            stack:err.stack,
                             
                            class: <string> <unknown>this
                        }
                        LogError(error_log);


let response_error: RESPONSE_TYPE = {
                       
                            status: 500,
                            message: "unknown error occurred",
                            data: [],
                            statusCode: "UNKNOWN_ERROR"

                        }
                        reject(response_error)
                        return;
                    })

                }
else{
 

let response_error: RESPONSE_TYPE = {
    data: [],
    message: "Please enter all required fields",
    status: 400,
    statusCode: "FORM_REQUIREMENT_ERROR"
}
reject(response_error);
return;

}

}
catch(err: any){

 
    let error: ErrorDataType = {
        msg:`Error occurred. Error: ${err.message}` ,
        status: "STRONG",
        time:   new Date().toUTCString(),
        stack:err.stack,
        class: <string> <unknown>this
    }

LogError(error);
 
let response_error: RESPONSE_TYPE = {
    data: [],
    message: "unknown error occurred",
    status: 500,
    statusCode: "UNKNOWN_ERROR"
}
reject(response_error);
return;



}

 

        })
    
            
  
  }



/**
 * This method is used to retrieve all subscription plans from the database. 
 * If there are no plans in the database, it returns a "plans not found" message. 
 * If there's an error during the process, it logs the error and returns an error message. 
 * @returns 
 */
  viewAllPlans(): Promise<RESPONSE_TYPE> {
    return new Promise( (resolve:any, reject: any) => {

        AllSubscriptionPlans.find()
            .then( (plans: SubscriptionPlanType[]) => {

// check if plan is empty and return 404 error
                if (plans.length === 0) {
                    let res : RESPONSE_TYPE={
                        status: 404,
                        message: "plans not found",
                        data: [],
                        statusCode: "PLANS_NOT_FOUND"
                    }
                    reject(res)
                    return;
                }
else{ 

    let res : RESPONSE_TYPE={
               
                    status: 200,
                    message: "plans found successfully",
                    data: plans,
                    statusCode: "PLANS_FOUND"
    }
               resolve(res)
                return;
            }


            })
            .catch( (err: any) => {

                let error_log: ErrorDataType = {
                    msg:`Error occurred. Error: ${err.message}` ,
                    status: "MILD",
                    time:   new Date().toUTCString(),
                     
                    stack:err.stack,
                    class: <string> <unknown>this
                }
                LogError(error_log);


let response_error: RESPONSE_TYPE = {
               
                    status: 500,
                    message: "unknown error occurred, please try again",
                    data: [],
                    statusCode: "UNKNOWN_ERROR"
}
              reject( response_error  )

                return;
            })

    })






}

/**
 * This method is used to retrieve a specific subscription plan using the plan's ID. 
 * If the plan is not found, it returns a "plan not found" message. 
 * If there's an error during the process, it logs the error and returns an error message. 
 * 
 * @param planId - ObjectId of the plan to be viewed.
 * @returns 
 */
viewOnePlan(planId: ObjectId): Promise<RESPONSE_TYPE> {
    return new Promise( (resolve:any, reject: any) => {

        AllSubscriptionPlans.findOne({_id:planId})
            .then( (plans: any) => {

// check if plan is empty and return 404 error
                if (plans === null) {
                    let res : RESPONSE_TYPE={
                        status: 404,
                        message: "plan not found",
                        data: [],
                        statusCode: "RESOURCE_NOT_FOUND"
                    }
                    reject(res)
                    return;
                }
else{ 

    let res : RESPONSE_TYPE={
               
                    status: 200,
                    message: "plan data fetched successfully",
                    data: [plans],
                    statusCode: "SUCCESS"
    }
               resolve(res)
                return;
            }


            })
            .catch( (err: any) => {

                let error_log: ErrorDataType = {
                    msg:`Error occurred. Error: ${err.message}` ,
                    status: "MILD",
                    time:   new Date().toUTCString(),
                     
                    stack:err.stack,
                    class: <string> <unknown>this
                }
                LogError(error_log);


let response_error: RESPONSE_TYPE = {
               
                    status: 500,
                    message: "unknown error occurred, please try again",
                    data: [],
                    statusCode: "UNKNOWN_ERROR"
}
              reject( response_error  )

                return;
            })

    })






}






/**
 *  This method is used to update a specific subscription plan using the plan's ID and the new plan data. 
 * If the plan is not found, it returns a "plan not found" message. If the plan is updated successfully,
 *  it returns a success message. 
 * If there's an error during the process, it logs the error and returns an error message.
 * @param planId 
 * 
 * @param plan 
 * @returns 
 */
// update a plan
  updatePlan(planId: ObjectId, plan: SubscriptionPlanUpdateType): Promise<RESPONSE_TYPE> {
    return new Promise( (resolve:any, reject: any) => {

        AllSubscriptionPlans.findOneAndUpdate({_id:planId}, plan)
            .then( (plans: any) => {

// check if plan is empty and return 404 error
                if (plans === null) {
                    let res : RESPONSE_TYPE={
                        status: 404,
                        message: "plan not found",
                        data: [],
                        statusCode: "RESOURCE_NOT_FOUND"
                    }
                    reject(res)
                    return;
                }
else{ 

    let res : RESPONSE_TYPE={
               
                    status: 200,
                    message: "plan updated successfully",
                    data: [plans],
                    statusCode: "SUCCESS"
    }
               resolve(res)
                return;
            }


            })
            .catch( (err: any) => {

                let error_log: ErrorDataType = {
                    msg:`Error occurred. Error: ${err.message}` ,
                    status: "MILD",
                    time:   new Date().toUTCString(),
                     
                    stack:err.stack,
                    class: <string> <unknown>this
                }

                LogError(error_log);

                let response_error: RESPONSE_TYPE = {
                    status: 500,
                    message: "unknown error occurred, please try again",
                    data: [],
                    statusCode: "UNKNOWN_ERROR"
                }

                reject(response_error)
                return;
            

            })


})

  }


}
  
export const SubscriptionPlanController = new SubscriptionPlanModule();