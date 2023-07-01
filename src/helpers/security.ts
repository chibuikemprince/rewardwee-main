 
  
import {Application , Request, Response, NextFunction, response} from "express";
import { whitelistOrigin } from "./whitelist";
import { RESPONSE_TYPE } from "./customTypes";
import {response as HttpResponse} from "./misc"

export const security = (app: Application) => {
 
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.body = { ...req.query, ...req.body };

/* console.log({
from: req.baseUrl,
headers: req.headers,
hostname: req.hostname,
httpVersion: req.httpVersion,
path: req.path,
query: req.query,
secure: req.secure

})
    */ 
    if(req.body.hasOwnProperty("start")){
  
      req.body.start = Number(req.body.start )
    }
    
    if(req.body.hasOwnProperty("stop")){
  
    req.body.stop = Number(req.body.stop )
  
    } 
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    //: 
    next();
  });
};


export const allowOnlySpecificOrigins = function(req: Request, res: Response, next: NextFunction) {
  let  origin = req.protocol + '://' + req.get('host');         
                            
  // Check if the request is from an allowed domain
  if (!whitelistOrigin.includes(origin)) {
                                                                                                                    
    let error_res : RESPONSE_TYPE = {
      message: 'Origin is not allowed',
      data: [],
      status: 403,
      statusCode: 'ORIGIN_NOT_ALLOWED',
    };

    HttpResponse(res, error_res);;

    
   // res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    
  next();
  }

};




