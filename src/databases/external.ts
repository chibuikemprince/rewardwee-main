import {
    Schema, model, Types, Model,
  } from 'mongoose';


 

import {  
  
   LoginRecord, UserLoginRecordModelData, UserLoginRecordSchema,
  SubscriptionPlanDataModel, SubscriptionPlanSchema,SubscriptionPlan

}  from "reward_service_store_schemas"
 

//import {LoginRecord, UserLoginRecordData}  from "../../../rewardwee_database/src/login"
export const UserLoginRecord =  model<LoginRecord>(UserLoginRecordModelData.name, UserLoginRecordSchema);
 


export const AllSubscriptionPlans =  model<SubscriptionPlan>(SubscriptionPlanDataModel.name, SubscriptionPlanSchema);


