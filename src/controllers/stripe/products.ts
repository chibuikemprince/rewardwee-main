import Stripe from 'stripe';
import { RESPONSE_TYPE } from '../../helpers/customTypes';
import {StripeProductsModel}   from '../../databases/external';
import { getEnv } from '../../helpers/getEnv';
import { ObjectId } from 'mongoose';
import { ErrorDataType, LogError } from '../../helpers/errorReporting'; 

const stripeKey = getEnv("STRIPE_SECRET_KEY") as string;
const stripe = new Stripe( 
    stripeKey,
    {
       //@ts-ignore
      apiVersion: '2022-11-15',
    });
  

const   createAndUpdateProductDb = (
  name: string,
  description: string,
  custom_product_id: ObjectId
): Promise<RESPONSE_TYPE>  => {

return new Promise( (resolve, reject) => {
    stripe.products.create({
        name,
        description
      })
      .then( (product) => {

// save to db, use update and upsert: true
        StripeProductsModel.findOneAndUpdate( {custom_product_id}, { 
            $set: {
                custom_product_id,
                stripe_product_id: product.id,
                name: product.name,
                description: product.description
                }
                }
                , {upsert: true}
                )
                .then( (done: any) => {

                    let response: RESPONSE_TYPE= {
                        status: 200,
                        message: "Product saved to db",
                        data: [product], 
                        statusCode: "SUCCESS"
                    }
                    resolve(response);
                    return; 

                })
                .catch( (err) => {

                    let res_error: RESPONSE_TYPE= {
                        status: 500,
                        message: "Error saving product to db product",
                        data: [],
                        statusCode: "UNKNOWN_ERROR"
                    }
                    reject(res_error);
            
                    let error_log: ErrorDataType = {
                        msg: err.message,
                        status: "MILD",
                        time: new Date().toISOString(),
                        stack: err.stack,
                        class: "Stripe Products Function"
                    }
                    LogError(error_log);
                    return;
            
                  })

      
        


      })

      
      .catch( (err) => {

        let res_error: RESPONSE_TYPE= {
            status: 500,
            message: "Error creating product",
            data: [],
            statusCode: "UNKNOWN_ERROR"
        }
        reject(res_error);

        let error_log: ErrorDataType = {
            msg: err.message,
            status: "MILD",
            time: new Date().toISOString(),
            stack: err.stack,
            class: "Stripe Products Function"
        }
        LogError(error_log);
        return;

      }) 

    })

}


const    editAndUpdateProductDb = (
    name: string,
    description: string,
    productid:string,
    custom_product_id: ObjectId
  ): Promise<RESPONSE_TYPE> => {
  
  return new Promise( (resolve, reject) => {
    stripe.products.update(productid, {
          name,
          description
        })
        .then( (product) => {
  
  // save to db, use update and upsert: true
          StripeProductsModel.findOneAndUpdate( {custom_product_id}, { 
              $set: {
                  custom_product_id,
                  stripe_product_id: product.id,
                  name: product.name,
                  description: product.description
                  }
                  }
                  , {upsert: true}
                  )
                  .then( (done: any) => {
  
                      let response: RESPONSE_TYPE= {
                          status: 200,
                          message: "Product saved to db",
                          data: [product], 
                          statusCode: "SUCCESS"
                      }
                      resolve(response);
                      return; 
  
                  })
                  .catch( (err) => {
  
                      let res_error: RESPONSE_TYPE= {
                          status: 500,
                          message: "Error saving product to db product",
                          data: [],
                          statusCode: "UNKNOWN_ERROR"
                      }
                      reject(res_error);
              
                      let error_log: ErrorDataType = {
                          msg: err.message,
                          status: "MILD",
                          time: new Date().toISOString(),
                          stack: err.stack,
                          class: "Stripe Products Function"
                      }
                      LogError(error_log);
                      return;
              
                    })
  
        
          
  
  
        })
  
        
        .catch( (err) => {
  
          let res_error: RESPONSE_TYPE= {
              status: 500,
              message: "Error creating product",
              data: [],
              statusCode: "UNKNOWN_ERROR"
          }
          reject(res_error);
  
          let error_log: ErrorDataType = {
              msg: err.message,
              status: "MILD",
              time: new Date().toISOString(),
              stack: err.stack,
              class: "Stripe Products Function"
          }
          LogError(error_log);
          return;
  
        }) 
  
      })
  
  }
  

  export const createUpdateAndReturnProduct = (
    name: string,
    description: string,
    custom_product_id: ObjectId
    ) : Promise<RESPONSE_TYPE> => {
return new Promise( (resolve: any, reject: any) => { 
name = name.toLowerCase();
description = description.toLowerCase();
    StripeProductsModel.findOne( {custom_product_id} )
  .then( (product: any) => {
    if(product) {
console.log("db found product is ", product)
// retrieve product from stripe

stripe.products.retrieve(product.stripe_product_id)
  .then( (stripeproduct) => {

if( name.toLowerCase() != stripeproduct.name.toLowerCase() || stripeproduct.description?.toLowerCase() !=  description.toLowerCase())
{
  console.log("db found, not mactch")
    // update
    editAndUpdateProductDb(name, description, stripeproduct.id, custom_product_id)
    .then( (response: RESPONSE_TYPE) => {
        resolve(response);
        return;})
        .catch( (err: RESPONSE_TYPE) => {

            reject(err);
            return;

        })
}
else{
  console.log("db found, match")
let myResponse : RESPONSE_TYPE = {
    status: 200,
    message: "Product created successfully.",
    data: [stripeproduct],
    statusCode: "SUCCESS"
}
resolve(myResponse);    
return;

}

  })
  .catch( (err) => {

    if(err.code == "resource_missing"){
// create and update db
createAndUpdateProductDb(name, description, custom_product_id)
    .then( (response: RESPONSE_TYPE) => {
        resolve(response);
        return;
    
    })
    .catch( (err: RESPONSE_TYPE) => {
        reject(err);
        return;
    }   
    )

  

}  
    else{ 
    let res_error: RESPONSE_TYPE= {
        status: 500,
        message: "Error fetching product from stripe",
        data: [],
        statusCode: "UNKNOWN_ERROR"
    }
    reject(res_error);

    let error_log: ErrorDataType = {
        msg: err.message,
        status: "MILD",
        time: new Date().toISOString(),
        stack: err.stack,
        class: "Stripe Products Function"
    }
    LogError(error_log);
    return;

}
  })

 



    } else {

      console.log("db not found")
      createAndUpdateProductDb(name, description, custom_product_id)
      .then( (response: RESPONSE_TYPE) => {
        resolve(response);
        return;
      })
      .catch( (err: RESPONSE_TYPE) => {
        reject(err);
        return;
      })
    }
  })
  
  .catch( (err) => {

    let res_error: RESPONSE_TYPE= {
        status: 500,
        message: "Error fetching product from db product",
        data: [],
        statusCode: "UNKNOWN_ERROR"
    }
    reject(res_error);

    let error_log: ErrorDataType = {
        msg: err.message,
        status: "MILD",
        time: new Date().toISOString(),
        stack: err.stack,
        class: "Stripe Products Function"
    }
    LogError(error_log);
    return;

  })








})
    }


