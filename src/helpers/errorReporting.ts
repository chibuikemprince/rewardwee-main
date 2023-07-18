// import Logger from "logger";
// import pino from  'pino'
 
export type ErrorDataType = {
  msg: string;
  file?: string;
  stack?: string;
  class?: string;
  time: string;
  user?: string;
  admin?: string;
  status: 'STRONG' | 'MILD' | 'WEAK' | 'INFO';
};
 
export const LogError = (err: ErrorDataType) => {
  //'fatal', 'error', 'warn', 'info', 'debug'
  let loggerOrder = 'warn';
  if (err.status == 'STRONG') {
    loggerOrder = 'fatal';
  } else if (err.status == 'INFO') {
    loggerOrder = 'info';
  }
  
  console.log(err);
  return;
};
