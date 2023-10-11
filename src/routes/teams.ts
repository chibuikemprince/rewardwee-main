import { Router } from "express";

import { isTokenCorrect } from "../middlewares/header"; 
import TeamsMiddleware from "../middlewares/teams"

const pathRouter = Router();
const baseRouter = Router();


pathRouter.post("/create",  TeamsMiddleware.createTeams); 
pathRouter.get("/id",  TeamsMiddleware.createTeams); 
pathRouter.get("/name",  TeamsMiddleware.createTeams); 
pathRouter.get("/organization",  TeamsMiddleware.createTeams); 
pathRouter.patch("/update",  TeamsMiddleware.createTeams); 
pathRouter.delete("/delete",  TeamsMiddleware.createTeams); 

export default baseRouter.use("/teams", isTokenCorrect, pathRouter);

