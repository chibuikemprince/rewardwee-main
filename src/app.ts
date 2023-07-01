/* import express, { Application, Request, Response, NextFunction } from 'express';
import { security, allowOnlySpecificOrigins } from './helpers/security'; 
import { response } from './helpers/misc';
import { RESPONSE_TYPE } from './helpers/customTypes';
 import { LogError, ErrorDataType } from './helpers/errorReporting';
import cors from 'cors';
//import bodyParser from 'body-parser';
import { whitelistOrigin } from './helpers/whitelist';
 import { singleRouter } from './routes/single';


 
//routes 
const app: Application = express();

const corsOptions = {
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'token' 
  ],
  origin:  (origin: any, callback:any) => {
    console.log({origin})
    if (whitelistOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,POST,DELETE',
};


 //app.use(cors(corsOptions));

app.use(express.json({ limit: '100mb', type: 'application/json' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit:100 }));
//app.use(express.static(__dirname + '/public')); //put file in /public

app.use(allowOnlySpecificOrigins);
security(app);
 
  app.use('/api/v1/email', singleRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  var fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;

  let notFoundRes: RESPONSE_TYPE = {
    message: `${fullURL} page not found`,
    data: [],
    status: 404,
    statusCode: 'PAGE_NOT_FOUND',
  };
  response(res, notFoundRes);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  let errorLog: ErrorDataType = {
    msg: 'error found: ',
    stack: error.stack,
    status: 'STRONG',
    time: new Date().toDateString(),
  };
  LogError(errorLog);

  let error_res: RESPONSE_TYPE = {
    message: 'error detected, please try again.',
    data: [],
    status: 500,
    statusCode: 'UNKNOWN_ERROR',
  };
  response(res, error_res);
});


process.on("uncaughtException",(error: Error)=>{
  let errorLog: ErrorDataType = {
    msg: 'error found: ',
    stack: error.stack,
    status: 'STRONG',
    time: new Date().toDateString(),
  };
  LogError(errorLog);

   return;
})
export default app;
 */