import { Router } from "express";

import SubscriptionMiddleware from "../middlewares/SubscriptionPlanMiddleware";
import { isTokenCorrect } from "../middlewares/header"; 
import { isAdminTokenCorrect } from "../middlewares/adminauth"; 

const pathRouter = Router();
const baseRouter = Router();

 
// Subscription 
pathRouter.get("/all",  SubscriptionMiddleware.getAllPlan); 
pathRouter.get("/one",  SubscriptionMiddleware.getOnePlan); 
pathRouter.post("/create", isAdminTokenCorrect,  SubscriptionMiddleware.createPlan);
pathRouter.put("/update/", isAdminTokenCorrect,  SubscriptionMiddleware.updatePlan);

// get all currency

pathRouter.get("/currency/all",  SubscriptionMiddleware.getAllCurrency);
 
export default baseRouter.use("/plans", pathRouter);

