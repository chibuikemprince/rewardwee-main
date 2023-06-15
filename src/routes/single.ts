import express from 'express';
import {sendEmailMiddleware} from "../middlewares/single"

const myRouter = express.Router();
const baseRouter = express.Router();

baseRouter.post('/send', sendEmailMiddleware);

export const singleRouter = myRouter.use('/single', baseRouter);




