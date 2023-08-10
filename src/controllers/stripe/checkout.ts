 
import Stripe from 'stripe';
import { GeneralObject, RESPONSE_TYPE } from '../../helpers/customTypes';
import { ErrorDataType, LogError } from '../../helpers/errorReporting';
import { getEnv } from '../../helpers/getEnv';
import { PaymentPlatformsModel,  MyPaymentInvoiceData} from '../../databases/external';

import { ObjectId } from 'mongoose';
 

 const stripeKey = getEnv("STRIPE_SECRET_KEY") as string;

// Initialize the Stripe client with your API key
const stripe = new Stripe( 
  stripeKey,
  {
   
     //@ts-ignore
    apiVersion: '2022-11-15',
  });

// Define a function to create a payment link
export const createPaymentIntent =  (amount: number, description: string,
   payment_method: string,
    currency: string, user_id:ObjectId ,metadata?: GeneralObject): Promise<RESPONSE_TYPE> => {
 
    // metadata can have imageUrl 
    return new Promise((resolve : any, reject: any) => {  
       amount =  amount*100;
      stripe.paymentIntents.create({
        amount,
        currency ,
        statement_descriptor:description,
        description,
        payment_method,
        automatic_payment_methods: {
          enabled: true
        },
        metadata
      })
      .then((paymentIntent) => {

        let paymentData : MyPaymentInvoiceData  = {
          
          amount,
          currency,
          description,
          platform_id: paymentIntent.id,
          platform: "STRIPE",
          user_id,
          metadata: paymentIntent


        }
        PaymentPlatformsModel.create(paymentData)
        .then((saved: any)=>{
          let res: RESPONSE_TYPE = {
            data: [paymentIntent],
            message: "Payment Created Successfully.",
            status: 200,
            statusCode: "SUCCESS"
          }
  
          resolve(res);
          return
        })

        .catch((err) => {

          let res: RESPONSE_TYPE = {
            data: [{error: err.message}],
            message: "there was an error in creating payment, please try again",
            status: 500,
            statusCode: "UNKNOWN_ERROR"
          }
  
          reject(res);
  
          let error_log :ErrorDataType = {
            msg: "there was an error in creating payment, please try again",
            status: "MILD",
            time: new Date().toISOString(),
            stack: err.stack,
            class: "StripePaymentIntent" 
            
  
          }
  
          LogError(error_log);
          return
  
  
  })
  
        
      })

.catch((err) => {

        let res: RESPONSE_TYPE = {
          data: [{error: err.message}],
          message: "there was an error in creating payment, please try again",
          status: 500,
          statusCode: "STRIPE_ERROR"
        }

        reject(res);

        let error_log :ErrorDataType = {
          msg: "there was an error in creating payment, please try again",
          status: "MILD",
          time: new Date().toISOString(),
          stack: err.stack,
          class: "StripePaymentIntent" 
          

        }

        LogError(error_log);
        return


})



    })

     
  // return paymentIntent 
}

// Define a function to verify a payment
export const verifyPayment =  (paymentIntentId: string): Promise<RESPONSE_TYPE> => {

return new Promise((resolve : any, reject: any) => {


   const paymentIntent =  stripe.paymentIntents.retrieve(paymentIntentId)
   .then((paymentIntent) => {
// console.log({paymentIntent});

    if(paymentIntent.status === "succeeded"){
     let res: RESPONSE_TYPE = {
      data: [],
      message: "Payment Verified Successfully.",
      status: 200,
      statusCode: "SUCCESS"
    }

    resolve(res);
    return

  }
  else{

    let res: RESPONSE_TYPE = {
      data: [{status: paymentIntent.status}],
      message: "Payment not verified. ",
      status: 500,
      statusCode: "PAYMENT_UNSUCCESSFUL"
    }

    reject(res);
/* 
    let error_log :ErrorDataType = {
      msg: "Payment Failed.",
      status: "MILD",
      time: new Date().toISOString(),
      stack: "Payment Failed.",
      class: "StripePaymentIntent" 
      

    }

    LogError(error_log); */
    return

  



  }
   })
.catch((err) => {
  let res: RESPONSE_TYPE = {
    data: [{error: err.message}],
    message: "there was an error in verifying payment, please try again",
    status: 500,
    statusCode: "STRIPE_ERROR"
  }

  reject(res);

  let error_log :ErrorDataType = {
    msg: "there was an error in verifying payment, please try again",
    status: "MILD",
    time: new Date().toISOString(),
    stack: err.stack,
    class: "StripePaymentIntent" 
    

  }

  LogError(error_log);
  return


})


})

};
 
   