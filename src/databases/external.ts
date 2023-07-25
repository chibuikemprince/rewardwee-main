import {
    Schema, model, Types, Model,
  } from 'mongoose';


 

import {  
  
   LoginRecord, UserLoginRecordModelData, UserLoginRecordSchema,
  SubscriptionPlanDataModel, SubscriptionPlanSchema,SubscriptionPlan

}  from "reward_service_store_schemas"
 

import { StripeCustomersDataModel, StripeCustomersSchema }  from "../../../rewardwee_database/src/stripe/customers"

import { StripeCustomers, StripePrice, StripeProducts } from '../../../rewardwee_database/src/types';



import {StripeProductsDataModel, StripeProductsSchema  }  from "../../../rewardwee_database/src/stripe/products"
import { StripePriceDataModel, StripePriceSchema }  from "../../../rewardwee_database/src/stripe/prices"

 



export const StripeCustomersModel =  model<StripeCustomers>(StripeCustomersDataModel.name, StripeCustomersSchema);
export const StripeProductsModel =  model<StripeCustomers>(StripeProductsDataModel.name, StripeProductsSchema);
export const StripePriceModel =  model<StripePrice>(StripePriceDataModel.name, StripePriceSchema);






export const UserLoginRecord =  model<LoginRecord>(UserLoginRecordModelData.name, UserLoginRecordSchema);
 


export const AllSubscriptionPlans =  model<SubscriptionPlan>(SubscriptionPlanDataModel.name, SubscriptionPlanSchema);



