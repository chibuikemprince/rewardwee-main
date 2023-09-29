import {
    Schema, model, Types, Model,
  } from 'mongoose';


  import {
   TeamMembers,
   Teams,
   TeamMembersDataModel,
   TeamsDataModel,

   TeamMembersSchema,
   TeamsSchema
  
  } from "reward_service_store_schemas"

 

  // jobs
  
  export const TeamsModel =  model<Teams>(TeamsDataModel.name,  TeamsSchema );
  export const TeamMembersModel =  model<TeamMembers>(TeamMembersDataModel.name,  TeamMembersSchema );
 