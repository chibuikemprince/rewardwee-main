import mongoose from 'mongoose';
import { getEnv } from './getEnv';
import express, { Application } from 'express';
import { ErrorDataType, LogError } from './errorReporting';

var DBURI: string = getEnv('DB') as string;


console.log({ DBURI });


if (process.env.APP_ENV == 'production') {
  DBURI = getEnv('DB_PRODUCTION') as string;
}

export const startApp = (app: Application, port: number) => {
  mongoose.set("strictQuery", false);
  /* 
  When strict option is set to true, Mongoose will ensure that only the fields that are specified in your Schema will be saved in the database, and all other fields will not be saved (if some other fields are sent).
  */
  mongoose
    .connect(<string>DBURI)
    .then((start) => {

      let serviceName: string = <string>getEnv("SERVICE_NAME"); 
      app.listen(port, () => {
        console.log({
          message: 'App is now running.',
          port,
          DBURI,
          app: `http://localhost:${port}/rewardwee/${serviceName}`
        });
      });
    })
    .catch((err) => {
      let myerr: ErrorDataType = {
        msg: 'Error found, app could not start',
        stack: err.stack,
        status: 'STRONG',
        time: new Date().toDateString(),
      };

      console.log({ myerr });
    });
};
