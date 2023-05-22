import DotEnv from "dotenv"

DotEnv.config( );

import app from "./src/app";
import {getEnv} from "./src/helpers/getEnv";
import {LogError, ErrorDataType} from "./src/helpers/errorReporting"; 
import { startApp } from "./src/helpers/dbConnect"; 


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
   console.log({port})
  startApp(app,<number>port);