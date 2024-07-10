import {
    Schema, model, Types, Model,
  } from 'mongoose';


  import {
    UserModelData,
    UserModelSchema,
    IUser,

    LoginRecord,
    UserLoginRecordModelData,
    UserLoginRecordSchema,
   TeamMembers,
   Teams,
   TeamMembersDataModel,
   TeamsDataModel,
   TeamMembersSchema,
   TeamsSchema,

  
  } from "reward_service_store_schemas"

 

  // jobs
  
  export const TeamsModel =  model<Teams>(TeamsDataModel.name,  TeamsSchema );

//UserModelS
  export const UserModel =  model<IUser>(UserModelData.name,  UserModelSchema );


  export const TeamMembersModel =  model<TeamMembers>(TeamMembersDataModel.name,  TeamMembersSchema );
 console.log({teams: TeamsDataModel.name,  schema: TeamsSchema.obj.user_id })

  export const UserLoginRecord =  model<LoginRecord>(UserLoginRecordModelData.name, UserLoginRecordSchema);



