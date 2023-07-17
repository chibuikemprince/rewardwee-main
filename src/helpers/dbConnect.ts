import mongoose ,  { ConnectOptions } from 'mongoose';
import { getEnv } from './getEnv';
import express, { Application } from 'express';
import { ErrorDataType, LogError } from './errorReporting'; 

import { getAllGlobalEnv } from "../modules/globalEnv";





var DBURI: string = getEnv('DB') as string;

 


if (process.env.APP_ENV == 'production') {
  DBURI = getEnv('DB_PRODUCTION') as string;
}
 
// Mongoose connection options
const mongooseOptions  : ConnectOptions = {
  autoIndex: true, 
  autoCreate: true
}



export const startApp = (app: Application, port: number) => {
  mongoose.set("strictQuery", false);
  /* 

  When strict option is set to true, 
  Mongoose will ensure that only the fields that are specified in your Schema will be saved 
  in the database, and all other fields will not be saved (if some other fields are sent).

  */
  mongoose
    .connect(<string>DBURI, mongooseOptions)
    .then((done:any) => {

 /*      
getAllGlobalEnv()
.then((evn: any)=>{
 
})
.catch((err: any)=>{


  
  let myerr: ErrorDataType = {
    msg: 'Error found, app could not start, db connection failed',
    stack: err.stack,
    status: 'STRONG',
    time: new Date().toDateString(),
  };

  console.log({ myerr });
})


 */

let serviceName: string = <string>getEnv("SERVICE_NAME"); 
app.listen(port, () => {
  console.log({

    message: 'App is now running.',
    port,
    DBURI,
    serviceName,
    app: `http://localhost:${port}/rewardwee/${serviceName}`,
    time: new Date().toDateString()


  });
});



const db = mongoose.connection;

// Handle disconnection event
db.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Close the connection when the node process ends



const readyState = mongoose.connection.readyState;
console.log({ readyState }) ;



     
    })
    .catch((err :any) => {
      let myerr: ErrorDataType = {
        msg: 'Error found, app could not start, db connection failed',
        stack: err.stack,
        status: 'STRONG',
        time: new Date().toDateString(),
      };

      console.log({ myerr });
    });
};
