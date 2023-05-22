import { Response } from 'express';
import { RESPONSE_TYPE } from './customTypes';

export const response = (res: Response, data: RESPONSE_TYPE) => {
  data.status =
  data.status == undefined || data.status == null ? 500 : data.status;
  res.status(data.status).json(data);
  return;
};


