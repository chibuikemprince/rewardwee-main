import { ObjectId } from "mongoose";
import { RESPONSE_TYPE, StripePrices, StripeProducts, stripeInterval } from "../../helpers/customTypes";
import { createAndReturnPrices } from "./price";
import { ErrorDataType, LogError } from "../../helpers/errorReporting";
import { PaymentPlatformsModel, SubscriptionModel , SubscriptionLogModel} from "../../databases/external";
import { getEnv } from "../../helpers/getEnv";
import Stripe from "stripe";
import { getPlanInfo } from "../plans";

const stripeKey = getEnv("STRIPE_SECRET_KEY") as string;
const stripe = new Stripe( 
    stripeKey,
    {
       //@ts-ignore
      apiVersion: '2022-11-15',
    });
  
// not in this project, users can only subscribe to a single product, either monthly or yearly.
// this is because the product sold for this project is just one, but with variation in duration.


export const getExistingSubscription = ( user_id: ObjectId,
    interval: stripeInterval) :Promise<RESPONSE_TYPE>=>{
        return new Promise((resolve:any, reject: any)=>{
        SubscriptionModel.findOne({ user_id, interval })
        .then((subscription: any)=>{
if(subscription){
    let res_data  :RESPONSE_TYPE = {
        data:[
           {
            subscription
        
        }

        ],
        message: "subscription fetched successfully.",
        status: 200,
        statusCode: "SUCCESS"
    }
    
    resolve(res_data)
    return;


   /*  stripe.subscriptions.retrieve(subscription.platform_id)
    .then((stripe_sub: any)=>{
        
    let res_data  :RESPONSE_TYPE = {
        data:[
           {
            stripe: stripe_sub,
            db:subscription
        
        }

        ],
        message: "subscription fetched successfully.",
        status: 200,
        statusCode: "SUCCESS"
    }
    
    resolve(res_data)
    return;
    })

    .catch((err: any)=>{
        let err_res: RESPONSE_TYPE = {
        
            data:[],
            message: "error occurred, please try again.",
            status: 500,
            statusCode: "STRIPE_ERROR"
        
        }
        
if(err.code == "resource_missing"){

    err_res.message = "subscription does not exist.";
    err_res.status = 404;
    err_res.statusCode  = "STRIPE_NOT_FOUND";
}
else{

    let err_log : ErrorDataType = {
        msg: "an error occurred, please try again.",
        status: "MILD",
        time: new Date().toISOString(),
        stack: err.stack,
        class: "GetSubscription function"
        
        }
        
        
                    LogError(err_log);
                    return;

}


reject(err_res)
    
       
                }) */

}
else{
let res_data  :RESPONSE_TYPE = {
    data:[],
    message: "no subscription found.",
    status: 404,
    statusCode: "RESOURCE_NOT_FOUND"
}

resolve(res_data)
return;
}
          
        })
        .catch((err: any)=>{

let err_res: RESPONSE_TYPE = {

    data:[],
    message: "an error occurred, please try again.",
    status: 500,
    statusCode: "UNKNOWN_ERROR"

}

let err_log : ErrorDataType = {
msg: "an error occurred, please try again.",
status: "MILD",
time: new Date().toISOString(),
stack: err.stack,
class: "GetSubscription function"

}


            LogError(err_log);
            reject(err_res)
            return;
        })
    })


}







// Create a monthly subscription with a 14-day trial period
export const createSubscriptionWithTrial = (
    user_id: ObjectId,
    interval: stripeInterval,
    product: StripeProducts,
    prices: StripePrices,
    customerId: string,
    durationInDays: number,
    trial_period_days: number
    
    ): Promise<RESPONSE_TYPE> => {

    return new Promise(( resolve:any, reject: any)=>{

        let {name} = product;
        let {  amount ,
            currency ,
            description ,
            custom_product_id,
            interval } = prices

        createAndReturnPrices( name, amount ,
            currency ,
            description ,
            custom_product_id, interval )
            .then((prices: RESPONSE_TYPE)=>{

                stripe.subscriptions.create({
                    customer: customerId,
                    items: [{ price: prices.data[0].id }],
                    payment_behavior: 'default_incomplete',
                     payment_settings: { save_default_payment_method: 'on_subscription' },
                    expand: ['latest_invoice.payment_intent'],
                    trial_period_days,
                  })
                  .then((subscription: any)=>{
let date_expiry = 0;
let total_days = trial_period_days + durationInDays;
switch (interval) {
    case 'day':
        total_days = total_days+1;
       break;
    case 'week':
        total_days = total_days+7;
         break;
    case 'month':
        total_days = total_days+30;
         break;
    case 'year':
        total_days = total_days+386;
         break;
    default:
        let invalid_interval : RESPONSE_TYPE = {
            message: interval +" is not a valid interval for subscription.",
            status: 500,
            statusCode: "UNKNOWN_ERROR",
            data: []
        }
        reject(invalid_interval)
       
  }

  date_expiry = Date.now() + (total_days * 24 * 60 * 60 * 1000);


// save to db,
// if failed to save to db, cancel subscription


let subscription_create = {
    user_id,
    interval,
    description,
    metadata: subscription,
    active: false ,
    date_expiry,
    trial_period_days
}

SubscriptionModel.create(subscription_create)
.then((sub_saved: any)=>{

    SubscriptionLogModel.create({
...subscription_create, message: "subscription created successfully"
    })
    .then((sub_log: any)=>{

        
    // save to db,

    let res_saved : RESPONSE_TYPE = {
        data: [],
        message: "subscription created successfully",
        status: 200,
        statusCode:"SUCCESS"
    }

    resolve(res_saved);
    return;
    })
    .catch((sub_log_error: any)=>{

    // save to db,

    let res_saved : RESPONSE_TYPE = {
        data: [],
        message: "subscription created successfully",
        status: 200,
        statusCode:"SUCCESS"
    }
    let error_log : ErrorDataType = {
        msg: "error occurred after creating and logging subscription",
        status: "MILD",
        time: new Date(). toISOString(),
        stack: sub_log_error.stack,
        class: "Stripe Subscription function."
    
    }

    LogError(error_log);
    resolve(res_saved);
    return;
    })



})
.catch((sub_error: any)=>{


    // cancel subscription
    cancelSubscription(subscription.id)
    .then((sub_error: any)=>{
        sub_error.message = "error occurred while saving subscription, please try again."
        
        
        reject(sub_error)
        return;
    })
    .catch((sub_error: any)=>{
        sub_error.message = "error occurred while saving subscription, please try again."
        
        
        reject(sub_error)
        return;
    })

    

})

                    let sub_done = {
                        subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
                    }

let res : RESPONSE_TYPE = {
    data: [sub_done],
    message: "subscription created successfully",
    status: 200,
    statusCode:"SUCCESS"
}

resolve(res);
return;

                  })
                  .catch((sub_error: any)=>{

                    let error_res :RESPONSE_TYPE = {
                        data:[],
                        message:" error occurred while creating subscription",
                        status:500,
                        statusCode: "STRIPE_ERROR"
                    
                    }
                    let error_log : ErrorDataType = {
                        msg: "error occurred while creating subscription",
                        status: "MILD",
                        time: new Date(). toISOString(),
                        stack: sub_error.stack,
                        class: "Stripe Subscription function."
                    
                    }

                    LogError(error_log);
                    reject(error_res);
                    return;
                  })

                  })

                  .catch((error: RESPONSE_TYPE)=>{
                    reject(error);
                    return;
                                })
            })
         


    }


    export const startSubscription =  (user_id: ObjectId, plan_id: ObjectId) : Promise<RESPONSE_TYPE> => {
        return new Promise((resolve:any, reject: any)=>{
            
// check if plan_exist
// check if subscription exist
// if there is an active subscription, cancel it  create a new subscription 
// if no active subscription, create one

getPlanInfo(plan_id)
.then((plan_found: any)=>{
if(plan_found.data.length>0){
// plan exist
let plan_info = plan_found.data[0];
console.log("plan info found", plan_info)
let {name, duration, freeTrialDuration, price, currency, description} = plan_info;
/* 
 name: string;
    duration: number; // in months
    price: number;
    currency: Currency;
    adminId: ObjectId;
    freeTrialDuration?: number; // in days
    description?: string[] 
*/
let interval: stripeInterval = duration < 12 || duration%12 != 0 ? 'month' :  'year' ;



getExistingSubscription(user_id, interval)
.then((subscription_found: RESPONSE_TYPE)=>{
    if(subscription_found.statusCode == "SUCCESS"){
        let {platform_id, platform, active, cancelled } = subscription_found.data[0];
 let subscriptionId = platform_id;
 // check if subscription is active
 if(cancelled){
     // subscription is active, cancel it
     
 }   
 
 else{
general


 }
 /* 
          platform_id: string;
  platform: SupportedPaymentPlatformsType ;
  description: string;
  metadata: GeneralObject;
  date: Date;
  date_expiry: number
  date_epoch: number;
  active: boolean;
  user_id: ObjectId; */
        if(subscriptionId){

        
        }
        else{
            //createAndReturnSubscription(user_id, plan_id, duration, price, currency, description, freeTrialDuration)
        }
    }
    else{
        // subscription not found.


    }
})
.catch((subscription_notfound: RESPONSE_TYPE)=>{
    reject(subscription_notfound)
    return;
})
}
else{
    reject(plan_found)
    return;
}


})
.catch((plan_notfound: RESPONSE_TYPE)=>{
    reject(plan_notfound)
    return;
})




        

        })
    
    }
//export const getTrialPeriod(user_id: ObjectId, )



// Create a yearly subscription with a 30-day trial period
/* export async function createYearlySubscriptionWithTrial(customerId: string): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: '<YEARLY_PLAN_PRICE_ID>' }],
    trial_period_days: 30,
  });
  return subscription;
}
 */


 
export const cancelSubscription = (
    subscriptionId: string
    
    ): Promise<RESPONSE_TYPE> => {

    return new Promise(( resolve:any, reject: any)=>{

        stripe.subscriptions.del(subscriptionId)
        .then((sub_done: any)=>{

let res : RESPONSE_TYPE = {
    data: [sub_done],
    message: "subscription cancelled successfully",
    status: 200,
    statusCode:"SUCCESS"
}

resolve(res);
return;

                  })
                  .catch((sub_error: any)=>{

                    let error_res :RESPONSE_TYPE = {
                        data:[],
                        message:" error occurred while cancelling subscription",
                        status:500,
                        statusCode: "STRIPE_ERROR"
                    
                    }
                    let error_log : ErrorDataType = {
                        msg: "error occurred while cancelling subscription",
                        status: "MILD",
                        time: new Date(). toISOString(),
                        stack: sub_error.stack,
                        class: "Stripe Subscription function."
                    
                    }

                    LogError(error_log);
                    reject(error_res);
                    return;
                  })
            })
         


    }

