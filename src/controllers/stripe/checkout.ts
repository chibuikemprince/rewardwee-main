 
import Stripe from 'stripe';
import { GeneralObject, RESPONSE_TYPE } from '../helpers/customTypes';
import { ErrorDataType, LogError } from '../helpers/errorReporting';
import { getEnv } from '../../helpers/getEnv';
 

 const stripeKey = getEnv("STRIPE_KEY") as string;

// Initialize the Stripe client with your API key
const stripe = new Stripe( 
  stripeKey,
  {
   
     //@ts-ignore
    apiVersion: '2022-11-15',
  });

// Define a function to create a payment link
export const createPaymentLink =  (amount: number, description: string,
   payment_method: string, currency: string, metadata?: GeneralObject): Promise<RESPONSE_TYPE> => {

    // metadata can have imageUrl 
    return new Promise((resolve : any, reject: any) => {
      stripe.paymentIntents.create({
        amount: amount*100,
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
 

// Create a test payment method using a test card number
/* 
  stripe.paymentMethods.create({
  type: 'card',
  card: {
    number: '4242 4242 4242 4242',
    exp_month: 12,
    exp_year: 25,
    cvc: '123',
  },
})
.then((paymentMethod) => {

 console.log('Payment method ID:', paymentMethod.id);


 createPaymentLink(1000, "test payment", paymentMethod.id, "usd", {})
 .then((clientSecret) => {
   console.log({clientSecret: clientSecret.data[0]});
   verifyPayment(clientSecret.data[0].id)
   .then((verified) => {
    // console.log({verified: verified.data[0]});
   })
   .catch((err) => {
     // console.log({verr:err});
   })

 }
 )
 .catch((err) => {
   console.log({err});
 }
 );





})
.catch((err) => {
  console.log(err, "payment method error");
} )

 */


 class StripePaymentModule {

  private stripe: Stripe;

   constructor(apiKey: string) {

    this.stripe = new Stripe(apiKey, {
      apiVersion: '2020-08-27',
    });


  }
   public async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
    });
     return paymentIntent;
  }
   public async createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
    });
     return subscription;
  }
   public async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const canceledSubscription = await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
     return canceledSubscription;
  }
}
 export default StripePaymentModule; */