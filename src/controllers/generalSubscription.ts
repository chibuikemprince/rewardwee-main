import { ObjectId } from "mongoose";
import { PaymentPlatformsModel, SubscriptionModel , SubscriptionLogModel} from "../databases/external";
import { GeneralObject, RESPONSE_TYPE } from "../helpers/customTypes";
import { ErrorDataType, LogError } from "../helpers/errorReporting"; 
import { platform } from "os";
import { cancelSubscription  as StripeCancelSubscription} from "./stripe/subscription";
import { PaymentPlatformsType } from "../modules/types";


const CancelSubscriptionMethods : {[key in PaymentPlatformsType]: any} = {
"STRIPE" : StripeCancelSubscription


}
export const updateSubscription =   (subscription: ObjectId, newdata: GeneralObject): Promise<RESPONSE_TYPE> => {

    return new Promise(async (resolve, reject) => {

        SubscriptionModel.updateOne({_id: subscription}, newdata)
            .then( (subscription : any) => {
                let response: RESPONSE_TYPE = {
                    status: 200,
                    message: "Subscription updated successfully",
                    data: [],
                    statusCode: "SUCCESS"
                }
                resolve(response)
                return;
            })
            
            .catch( (err: any) => {

let error_log: ErrorDataType = {
    msg: "Error in updating subscription",
    status: "MILD",
     time: new Date().toISOString(),
     class: "generalSubscription update function",
     stack: err.stack
}

LogError(error_log)

                let err_res: RESPONSE_TYPE = {
                    data: [],
                    message: "Error in updating subscription",
                    statusCode: "UNKNOWN_ERROR",
                    status: 500
                }

reject(err_res)
                return; 

            })
            
    })

}

export const cancelGeneralSubscriptionByPlatform = ( subscription: ObjectId, platform: PaymentPlatformsType) :Promise<RESPONSE_TYPE> =>{
    return new Promise(  (resolve: any, reject : any) => {
        // get subscription calcel function based on platform.
     //   resolve(true)
       //  return;
    if(CancelSubscriptionMethods[platform]){
        CancelSubscriptionMethods[platform](subscription)
        .then( (response : RESPONSE_TYPE) => {
            resolve(response)
            return;
        })
        .catch( (err: RESPONSE_TYPE) => {
            reject(err)
            return;
        })
    }
    else{
        let err_res: RESPONSE_TYPE = {
            data: [],
            message: "Error in finding subscription, an invalid platform was detected. ",
            statusCode: "UNKNOWN_ERROR",
            status: 500
        }

        let error_log: ErrorDataType = {
            msg: "Error in finding subscription, an invalid platform was detected. ",
            status: "MILD",
            time: new Date().toISOString(),
            class: "generalSubscription cancel function"
        }

        LogError(error_log );
        reject(err_res)
        return;
    }
    })
}


export const cancelGeneralSubscription = (subscription: ObjectId): Promise<RESPONSE_TYPE> =>{

    return new Promise(async (resolve, reject) => {

        SubscriptionModel.findOne({_id: subscription})
            .then( async (subscription : any) => {

                if(subscription.cancelled  == false){

                    cancelGeneralSubscriptionByPlatform(subscription._id, subscription.platform)
                        .then( (cancel_subscription : RESPONSE_TYPE) => {
                            let newdata = {
                                cancelled: true
                              }
      
                              updateSubscription(subscription._id, newdata)
                                  .then( (response : RESPONSE_TYPE) => {
                                      resolve(response)
                                      return;
                                  })
                                  .catch( (err: RESPONSE_TYPE) => {
                                      reject(err)
                                      return;
                                  })
                        })
                        .catch( (cancel_subscription: RESPONSE_TYPE) => {
                            reject(cancel_subscription)
                            return;
                        })

                
 





                }
                
                else{
                    let response: RESPONSE_TYPE = {
                        data: [],
                        message: "Subscription is already cancelled",
                        statusCode: "UNKNOWN_ERROR",
                        status: 200
                    }
                    resolve(response)
                    return;
                    }
                })
                .catch( (err: any) => {
let err_res : RESPONSE_TYPE = {
    data: [],
    message: "Error in finding subscription",
    statusCode: "UNKNOWN_ERROR",
    status: 500
}

reject(err_res)

let error_log: ErrorDataType = {
    msg: err.message,
    status: "MILD",
    time: new Date().toISOString(),
    class: "generalSubscription cancel function",
    stack: err.stack
}


LogError(error_log)

                return;
                }  )






            })
}
