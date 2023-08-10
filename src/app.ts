import express, { Application, Request, Response, NextFunction } from 'express';
import { security } from './helpers/security'; 
import { response } from './helpers/misc';
import { RESPONSE_TYPE } from './helpers/customTypes';
 import { LogError, ErrorDataType } from './helpers/errorReporting';
import cors from 'cors';


//import bodyParser from 'body-parser';
import { whitelistOrigin } from './helpers/whitelist';


// test
import Stripe from "stripe"
import { createPaymentIntent, verifyPayment } from './controllers/stripe/checkout';
import { ObjectId } from 'mongoose';
import { getEnv } from './helpers/getEnv';
 

const stripeKey = getEnv("STRIPE_SECRET_KEY") as string;
console.log({stripeKey})
// Initialize the Stripe client with your API key
const stripe = new Stripe( 
  stripeKey,
  {
   
     //@ts-ignore
    apiVersion: '2022-11-15',
  });
/// test end


/* 
import { ObjectId } from 'mongoose';
import { createAndReturnPrices } from './controllers/stripe/price';

 */

//routes 
const app: Application = express();

const corsOptions = {
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'token' 
  ],
  origin:  (origin: any, callback:any) => {
    // console.log({origin})
    if (whitelistOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,POST,DELETE',
};


 //app.use(cors(corsOptions));

app.use(express.json({ limit: '100mb', type: 'application/json' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit:100 }));
 
security(app);


 //app.use("/app/v1/subscription", SubscriptionRouter); 

  

app.use('*', (req: Request, res: Response, next: NextFunction) => {

  console.log("Customers .....")
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
  
  
   createPaymentIntent(1000, "test payment", paymentMethod.id, "usd",<ObjectId><unknown>"64b56fdccca5a7573ddabd06", {})
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
  
 
 /* createAndReturnPrices = (
    productName: string, 
    amount: number,
  currency: string,
  d
  escription: string,
  custom_product_id: ObjectId
    )  */
 /* 
    createAndReturnPrices("Pro Plan", 1000, "usd", "Pro pricing plan.",  <ObjectId><unknown>"64b7ba9a3713c45a0b6bcd54")
  .then( (response: RESPONSE_TYPE) => {
      console.log(response);
  })
  
  .catch( (err: RESPONSE_TYPE) => {
      console.log(err);
  })
  
   */

  var fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;

  let notFoundRes: RESPONSE_TYPE = {
    message: `${fullURL} page not found`,
    data: [],
    status: 404,
    statusCode: 'PAGE_NOT_FOUND',
  };
  response(res, notFoundRes);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  let errorLog: ErrorDataType = {
    msg: 'error found: ',
    stack: error.stack,
    status: 'STRONG',
    time: new Date().toDateString(),
  };
  LogError(errorLog);

  let error_res: RESPONSE_TYPE = {
    message: 'error detected, please try again.',
    data: [],
    status: 500,
    statusCode: 'UNKNOWN_ERROR',
  };
  response(res, error_res);
});


process.on("uncaughtException",(error: Error)=>{
  let errorLog: ErrorDataType = {
    msg: 'error found: ',
    stack: error.stack,
    status: 'STRONG',
    time: new Date().toDateString(),
  };
  LogError(errorLog);

   return;
})
export default app;
