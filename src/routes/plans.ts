import { Router } from "express";

import SubscriptionMiddleware from "../middlewares/SubscriptionPlanMiddleware";
import { isTokenCorrect } from "../middlewares/header"; 

const pathRouter = Router();
const baseRouter = Router();

 
// Subscription 
pathRouter.get("/all", isTokenCorrect,  SubscriptionMiddleware.getAllPlan); 

 
export default baseRouter.use("/plans", pathRouter);

