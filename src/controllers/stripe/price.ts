

// check if a product exist for a given price and

import Stripe from 'stripe';
import { RESPONSE_TYPE } from '../../helpers/customTypes';
import {StripePriceModel}   from '../../databases/external';
import { getEnv } from '../../helpers/getEnv';
import { ObjectId } from 'mongoose';
import { ErrorDataType, LogError } from '../../helpers/errorReporting'; 
import { createUpdateAndReturnProduct } from './products';
import { create } from 'domain';

const stripeKey = getEnv("STRIPE_SECRET_KEY") as string;
const stripe = new Stripe( 
    stripeKey,
    {
       //@ts-ignore
      apiVersion: '2022-11-15',
    });
  
/* 
name: string;
  amount: number;
  currency: string;
  stripe_price_id: string;
  custom_product_id: ObjectId;
  description: string;

*/


const   createAndUpdatePriceDb = (
  amount: number,
  currency: string,
  description: string,
  productId: string,
  custom_product_id: ObjectId
): Promise<RESPONSE_TYPE>  => {
console.log("create new prices");
return new Promise( (resolve, reject) => {
 
    stripe.prices.create({
      product: productId,
      unit_amount: amount,
      currency: currency,
      recurring: {  
        interval: 'month'

      }
      })
      .then( (prices) => {

// save to db, use update and upsert: true
        StripePriceModel.findOneAndUpdate( {custom_product_id, amount}, { 
            $set: {
                custom_product_id,
                currency,
                amount,
                stripe_price_id: prices.id,
                description: description
                }
                }
                , {upsert: true}
                )
                .then( (done: any) => {

                    let response: RESPONSE_TYPE= {
                        status: 200,
                        message: "Price saved to db",
                        data: [prices], 
                        statusCode: "SUCCESS"
                    }
                    resolve(response);
                    return; 

                })
                .catch( (err) => {

                    let res_error: RESPONSE_TYPE= {
                        status: 500,
                        message: "Error saving price to db prices",
                        data: [],
                        statusCode: "UNKNOWN_ERROR"
                    }
                    reject(res_error);
            
                    let error_log: ErrorDataType = {
                        msg: err.message,
                        status: "MILD",
                        time: new Date().toISOString(),
                        stack: err.stack,
                        class: "Stripe Prices Function"
                    }
                    LogError(error_log);
                    return;
            
                  })

      
        


      })

      
      .catch( (err) => {

        let res_error: RESPONSE_TYPE= {
            status: 500,
            message: "Error creating prices",
            data: [],
            statusCode: "UNKNOWN_ERROR"
        }
        reject(res_error);

        let error_log: ErrorDataType = {
            msg: err.message,
            status: "MILD",
            time: new Date().toISOString(),
            stack: err.stack,
            class: "Stripe Prices Function"
        }
        LogError(error_log);
        return;

      }) 

    })

}

 
  export const createAndReturnPrices = (
    productName: string, 
    amount: number,
  currency: string,
  description: string,
  custom_product_id: ObjectId
    ) : Promise<RESPONSE_TYPE> => {
return new Promise( (resolve: any, reject: any) => { 
 
description = description.toLowerCase();
amount = amount*100;

createUpdateAndReturnProduct(productName, description, custom_product_id)
    .then( (product: RESPONSE_TYPE) => {
      let productId = product.data[0].id;
      console.log(" price product created ", productId)
      StripePriceModel.findOne( {custom_product_id, amount, currency} )
      .then( (price: any) => {
console.log("price db found is ", price, "query is - ", {custom_product_id, amount, currency})

        if(price) {

// retrieve price from stripe
console.log("price db found")
stripe.prices.retrieve(price.stripe_price_id)
  .then( (stripeprice) => {
    console.log("Price retrieved from stripe ", stripeprice)
if( amount != stripeprice.unit_amount || currency != stripeprice.currency)
{
console.log("update price.")
    // update
     createAndUpdatePriceDb(amount, currency, description, productId, custom_product_id)
    .then( (response: RESPONSE_TYPE) => {
        resolve(response);
        return;})
        .catch( (err: RESPONSE_TYPE) => {

            reject(err);
            return;

        })
}
else{

let myResponse : RESPONSE_TYPE = {
    status: 200,
    message: "Price created successfully.",
    data: [stripeprice],
    statusCode: "SUCCESS"
}
resolve(myResponse);    
return;

}

  })
  .catch( (err) => {
    if(err.code == "resource_missing"){

      // create and update db
      createAndUpdatePriceDb(amount, currency, description, productId, custom_product_id)
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
                class: "Stripe Prices Function"
            }
            LogError(error_log);
            return;
      
            }


  })
        }
        else{
          // not found

          console.log("price db not found")
 // create and update db
 createAndUpdatePriceDb(amount, currency, description, productId, custom_product_id)
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

      })
      .catch( (err: any) => {

        
      let res_error: RESPONSE_TYPE= {
        status: 500,
        message: "Error fetching price from db",
        data: [],
        statusCode: "UNKNOWN_ERROR"
    }
    reject(res_error);

    let error_log: ErrorDataType = {
        msg: err.message,
        status: "MILD",
        time: new Date().toISOString(),
        stack: err.stack,
        class: "Stripe Prices Function"
    }
    LogError(error_log);
    return;
      
      })

    })
    .catch( (err: RESPONSE_TYPE) => {
      reject(err);
      return;
    })
 






})
    }





