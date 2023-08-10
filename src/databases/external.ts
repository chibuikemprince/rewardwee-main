import {
    Schema, model, Types, Model,
  } from 'mongoose';


 

import {  
  
   LoginRecord, UserLoginRecordModelData, UserLoginRecordSchema,
  SubscriptionPlanDataModel, SubscriptionPlanSchema,SubscriptionPlan

}  from "reward_service_store_schemas"
 

import { StripeCustomersDataModel, StripeCustomersSchema }  from "../../../rewardwee_database/src/stripe/customers"
import { GeneralPaymentInvoiceDataModel, GeneralPaymentInvoiceSchema, PaymentPlatforms }  from "../../../rewardwee_database/src/payments/payments"
import { GeneralSubscriptionDataModel, GeneralSubscriptionSchema }  from "../../../rewardwee_database/src/payments/subscription"
import { GeneralSubscriptionLogDataModel, GeneralSubscriptionLogSchema }  from "../../../rewardwee_database/src/payments/subscriptionlogs"

import { StripeCustomers, StripePrice, StripeProducts,
   GeneralPaymentInvoice, PaymentInvoiceData, GeneralSubscription, GeneralSubscriptionLog } from '../../../rewardwee_database/src/types';



import {StripeProductsDataModel, StripeProductsSchema  }  from "../../../rewardwee_database/src/stripe/products"
import { StripePriceDataModel, StripePriceSchema }  from "../../../rewardwee_database/src/stripe/prices"

 

export interface MyPaymentInvoiceData extends PaymentInvoiceData{}
export const SupportedPaymentPlatforms = PaymentPlatforms;

export const PaymentPlatformsModel =  model<GeneralPaymentInvoice>(GeneralPaymentInvoiceDataModel.name, GeneralPaymentInvoiceSchema);


export const SubscriptionModel =  model<GeneralSubscription>(GeneralSubscriptionDataModel.name, GeneralSubscriptionSchema);

export const SubscriptionLogModel =  model<GeneralSubscriptionLog>(GeneralSubscriptionLogDataModel.name, GeneralSubscriptionLogSchema);

export const StripeCustomersModel =  model<StripeCustomers>(StripeCustomersDataModel.name, StripeCustomersSchema);
export const StripeProductsModel =  model<StripeCustomers>(StripeProductsDataModel.name, StripeProductsSchema);
export const StripePriceModel =  model<StripePrice>(StripePriceDataModel.name, StripePriceSchema);






export const UserLoginRecord =  model<LoginRecord>(UserLoginRecordModelData.name, UserLoginRecordSchema);
 


export const AllSubscriptionPlans =  model<SubscriptionPlan>(SubscriptionPlanDataModel.name, SubscriptionPlanSchema);



