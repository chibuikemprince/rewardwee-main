
import ServerlessHttp from 'serverless-http';


import { startApp } from "./helpers/dbConnect"; 
import app from "./app";
import {getEnv} from "./helpers/getEnv";
import {LogError, ErrorDataType} from "./helpers/errorReporting"; 


//"./api/helpers/dbConnect";
 
  process.on("uncaughtException",(err:Error)=>{
    //
    let error:ErrorDataType = {
        msg:"uncaughtException error found",
        stack:err.stack,
        status:"STRONG",
        time:new Date().toDateString()
    }
LogError(error)



  })

  



  //RESPONSE_TYPE
  let port = getEnv("PORT");
   
  startApp(app,<number>port);


  export const handler =  ServerlessHttp(app)