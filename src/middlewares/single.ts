/* import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationError } from 'joi';
import {emailSchema} from "./schema"
import { EmailData, RESPONSE_TYPE } from '../helpers/customTypes';
import {single}  from "../constructor"
import { response } from '../helpers/misc';


export const sendEmailMiddleware = (req: Request, res: Response, next: NextFunction) => {


  const { error, value } = emailSchema.validate(req.body as EmailData);

  if (error) {
    const errorMessage = (error as ValidationError).details[0].message;
    //res.status(422).json({ error: errorMessage });

    let errorLog: RESPONSE_TYPE = {
        message: errorMessage,
        data: [],
        status: 422,
        statusCode: 'FORM_REQUIREMENT_ERROR',
        };
        response(res, errorLog);
    return;
  }
else{

    single(req.body)
    .then((data: RESPONSE_TYPE)=>{
       

        response(res,data)
    })
    .catch((err: RESPONSE_TYPE)=>{
        response(res,err);
    })


   
}

};
 */