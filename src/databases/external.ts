import {
    Schema, model, Types, Model,
  } from 'mongoose';


  

import { IUser, LoginRecord, UserModelSchema, UserModelData, UserLoginRecordModelData, UserLoginRecordSchema  }  from "reward_service_store_schemas"

export const UserModel =  model<IUser>(UserModelData.name,  UserModelSchema );



//import {LoginRecord, UserLoginRecordData}  from "../../../rewardwee_database/src/login"
export const UserLoginRecord =  model<LoginRecord>(UserLoginRecordModelData.name, UserLoginRecordSchema);



console.log({name1: UserModelData.name, name2: UserLoginRecordModelData.name })

