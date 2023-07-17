
import { model } from "mongoose";

// globalenv module
/* 
This code is a module that exports a function  `getGlobalEnv`  which takes a key as input and returns the corresponding value from the global environment. 
 The code imports the necessary dependencies from external modules, including  `GlobalParams`  and  `Env_val`  from "reward_service_global_env", and  `GlobalEnvSchema`  and  `GlobalEnvModelData`  from "reward_service_store_schemas". 
 It defines a model  `EnvParameter`  using  `GlobalEnvModelData`  and  `GlobalEnvSchema` . 
 It creates an instance of  `GlobalParams`  by passing  `EnvParameter`  as a parameter. 
 It initializes a variable  `myENV`  to null. 
 The  `getEnv`  function is defined as an async function that returns a promise.
  It checks if  `myENV`  is null, 
  and if so, retrieves the global environment 
  from the database using  `GlobalParamsObject.getFromDB()` . 
  It assigns the retrieved environment to  `myENV`  
  and resolves the promise with the environment.
   If  `myENV`  is not null, it resolves the promise with  `myENV`  directly. 
 The  `getGlobalEnv`  function is defined as a function that takes a key as input. 
 It calls the  `getEnv`  function to retrieve the global environment, 
 and then returns the corresponding value for the given key from the environment.
  If an error occurs during the retrieval of the environment, 
  it returns the corresponding error for the given key.
*/
import  {GlobalParams, Env_val} from "reward_service_global_env"
import {  GlobalEnvSchema,  GlobalEnvModelData, GlobalEnv  }  from "reward_service_store_schemas"
import fs from 'fs';
import path from 'path';
import {globalENVData} from "../../env"
 const currentFolderPath = path.dirname(__filename);
// console.log(currentFolderPath);

const EnvParameter =  model<GlobalEnv>(GlobalEnvModelData.name,  GlobalEnvSchema );

 

let GlobalParamsObject = new GlobalParams(EnvParameter);
 
let myENV: any = null;


  

export const getAllGlobalEnv = function() : Promise<any>{

    return new Promise( async (resolve: any, reject: any)=>{
  let count = 0;
      if(myENV==null){
           
 while(myENV==null){
  console.log({count})
  count = count +1;

  let env = await GlobalParamsObject.getFromDB()
           
 if( Object.values(env).length>0){
  myENV =env;
  
  fs.writeFile(currentFolderPath+'/globalenvdata.json', JSON.stringify(env), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('Data written to file successfully!');
    
  resolve(myENV);
  });


 }

 if(count > 20){
  process.exit();
 }
   
 }
      }
      else{
          console.log("Local ENV")
         
          resolve(myENV);
      }
  


    })
      
  } 




  export const getGlobalEnv =  function (key: string): Env_val{
 
let val: Env_val = globalENVData[key];
//console.log({key, val})
    return val;
  }


 // getGlobalEnv("a")


