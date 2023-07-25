 
import Stripe from 'stripe';
import { StripeCustomer, RESPONSE_TYPE } from '../../helpers/customTypes';
import { getEnv } from '../../helpers/getEnv';
import { StripeCustomersModel } from '../../databases/external';
 
import { ObjectId } from 'mongoose';
import { error } from 'console';
import { ErrorDataType , LogError} from '../../helpers/errorReporting';
import { create } from 'domain';

const stripeKey = getEnv("STRIPE_SECRET_KEY") as string;
//console.log({stripeKey})
// Initialize the Stripe client with your API key
const stripe = new Stripe( 
  stripeKey,
  {
   
     //@ts-ignore
    apiVersion: '2022-11-15',
  });

  
 const createAndSaveToDB = ( email: string, name: string, user_id: ObjectId): Promise<RESPONSE_TYPE> =>{

    return new Promise((resolve: any, reject: any) => {
        stripe.customers.create({
            name,
            email
          } )
          .then((newcustomer: any) => {
             
            StripeCustomersModel.findOneAndUpdate({user_id: user_id}, {
                $set: {
                    stripe_customer_id: newcustomer.id,
                    name: newcustomer.name,
                    email: newcustomer.email
                }
            }, {upsert: true})
            .then((dbcustomer: any) => {
                let success_res : RESPONSE_TYPE = {
                    status: 200,
                    data: [ newcustomer],
                    message: "Customer created successfully",
                    statusCode: "CUSTOMER_CREATED"
                }
                resolve(success_res);
                return;
            })
            .catch((error: any) => {
                 
    
        let error_res : RESPONSE_TYPE = {
            status: 500,
            data: [ ],
            message: "Internal Server Error",
            statusCode: "UNKNOWN_ERROR"
        }
    
    let error_log: ErrorDataType ={
        msg: error.message,
        status: "MILD",
        time: new Date().toISOString(),
        stack: error.stack,
        class: "Stripe createCustomers function"
    
    }
    reject(error_res);
    LogError(error_log);
    return;
    })
    
          })
    
          .catch((error: any) => {
              let error_res : RESPONSE_TYPE = {
                  status: 500,
                  data: [ ],
                  message: "Internal Server Error",
                  statusCode: "UNKNOWN_ERROR"
              }
      
          let error_log: ErrorDataType ={
              msg: error.message,
              status: "MILD",
              time: new Date().toISOString(),
              stack: error.stack,
              class: "Stripe createCustomers function"
      
          }
          reject(error_res);
          LogError(error_log);
          return;
          
    
    
          })
    
     



    })
}


  
const updateAndSaveToDB = ( email: string, name: string, user_id: ObjectId, customerId: string): Promise<RESPONSE_TYPE> => {

    return new Promise((resolve: any, reject: any) => {
        stripe.customers.update(customerId,{
            name,
            email
          } )
          .then((newcustomer: any) => {
             
            StripeCustomersModel.findOneAndUpdate({user_id: user_id}, {
                $set: {
                    stripe_customer_id: newcustomer.id,
                    name: newcustomer.name,
                    email: newcustomer.email
                }
            }, {upsert: true})
            .then((dbcustomer: any) => {
               
                let success_res : RESPONSE_TYPE = {
                    status: 200,
                    data: [ newcustomer],
                    message: "Customer updated successfully",
                    statusCode: "CUSTOMER_UPDATED"
                }
                resolve(success_res);
                return;
            })
            .catch((error: any) => {
                 
    
        let error_res : RESPONSE_TYPE = {
            status: 500,
            data: [ ],
            message: "Internal Server Error",
            statusCode: "UNKNOWN_ERROR"
        }
    
    let error_log: ErrorDataType ={
        msg: error.message,
        status: "MILD",
        time: new Date().toISOString(),
        stack: error.stack,
        class: "Stripe createCustomers function"
    
    }
    reject(error_res);
    LogError(error_log);
    return;
    })
    
          })
    
          .catch((error: any) => {
              let error_res : RESPONSE_TYPE = {
                  status: 500,
                  data: [ ],
                  message: "Internal Server Error",
                  statusCode: "UNKNOWN_ERROR"
              }
      
          let error_log: ErrorDataType ={
              msg: error.message,
              status: "MILD",
              time: new Date().toISOString(),
              stack: error.stack,
              class: "Stripe createCustomers function"
      
          }
          reject(error_res);
          LogError(error_log);
          return;
          
    
    
          })
    
     



    })
}




export   const createCustomer = (
    user_id: ObjectId,
  name: string,
  email: string
): Promise<RESPONSE_TYPE> => {
name = name.toLowerCase() ;
email = email.toLowerCase() ;

    return new Promise((resolve: any, reject: any) => {
        StripeCustomersModel.findOne({user_id: user_id})
        .then((customer: any) => {
            if(customer){
                console.log("found in db")
              
                 // customer already exists

stripe.customers.retrieve(customer.stripe_customer_id)
.then((customerInfo: any) => {

// check if customer data passed match the data returned by stripe
// if they don't match, update stripe data and db data as well

if(customerInfo.name.toLowerCase() != name || customerInfo.email.toLowerCase()  != email)
{
    
    console.log("info not matched")
    //return customer info
    updateAndSaveToDB(email, name, user_id, customerInfo.id)
    .then((res: any) => {
        resolve(res);
        return;
    })
    .catch((error: any) => {
        reject(error);
        return;
    })
}
else{
    console.log("info matched")
              
    let response: RESPONSE_TYPE = {
        status: 200,
        data: [customerInfo],
        message: "Customer created successfully",
        statusCode: "SUCCESS"
    
    }
    resolve(response);
    return;
}




})
.catch((error: any) => {

if(error.code == "resource_missing"){
    // customer does not exist
    // create a new customer and save to db 
    createAndSaveToDB(email, name, user_id)
    .then((res: any) => {
        resolve(res);
        return;
    
    })

    .catch((error: any) => {
       
    reject(error); 
    return;
    
    })

}  
            
            else{
                let error_res : RESPONSE_TYPE = {
                    status: 500,
                    data: [ ],
                    message: "Internal Server Error",
                    statusCode: "UNKNOWN_ERROR"
                }
            
            let error_log: ErrorDataType ={
                msg: error.message,
                status: "MILD",
                time: new Date().toISOString(),
                stack: error.stack,
                class: "Stripe createCustomers function"
            
            }
            reject(error_res);
            LogError(error_log);
            return;

            }
            
        


        })


    }
    else{
        // not found create new customer and save to db
           // customer does not exist
    // create a new customer and save to db 
    createAndSaveToDB(email, name, user_id)
    .then((res: any) => {
        resolve(res);
        return;
    
    })

    .catch((error: any) => {
       
    reject(error); 
    return;
    
    })


    }




})

        .catch((error: any)=>{
            let error_res : RESPONSE_TYPE = {
                status: 500,
                data: [ ],
                message: "Internal Server Error",
                statusCode: "UNKNOWN_ERROR"
            }

let error_log: ErrorDataType ={
    msg: error.message,
    status: "MILD",
    time: new Date().toISOString(),
    stack: error.stack,
    class: "Stripe createCustomers function"

}
reject(error_res);
LogError(error_log);
return;


        })



    })
 

}




// test above createCustomer function

