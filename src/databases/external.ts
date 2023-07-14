import {
    Schema, model, Types, Model,
  } from 'mongoose';


  

import {UserModelData, IUser}  from "../../../rewardwee_database/auth/users"
export const UserModel =  model<IUser>(UserModelData.name, UserModelData.schema);



import {LoginRecord, UserLoginRecordData}  from "../../../rewardwee_database/auth/login"
export const UserLoginRecord =  model<LoginRecord>(UserLoginRecordData.name, UserLoginRecordData.schema);