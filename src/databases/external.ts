import {
    Schema, model, Types, Model,
  } from 'mongoose';


 

import {   LoginRecord, UserLoginRecordModelData, UserLoginRecordSchema  }  from "reward_service_store_schemas"
 

//import {LoginRecord, UserLoginRecordData}  from "../../../rewardwee_database/src/login"
export const UserLoginRecord =  model<LoginRecord>(UserLoginRecordModelData.name, UserLoginRecordSchema);

/*  
  */

import { SubscriptionPlanDataModel, SubscriptionPlanSchema } from "../../../rewardwee_database/src/plans/plans"
import { SubscriptionPlan  } from "../../../rewardwee_database/src/types/index"


export const AllSubscriptionPlans =  model<SubscriptionPlan>(SubscriptionPlanDataModel.name, SubscriptionPlanSchema);


