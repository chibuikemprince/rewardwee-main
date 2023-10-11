import { Router } from "express";

import { isTokenCorrect } from "../middlewares/header"; 
import TeamsMiddleware from "../middlewares/teams"

const pathRouter = Router();
const baseRouter = Router();


pathRouter.post("/create", isTokenCorrect,  TeamsMiddleware.createTeams); 
pathRouter.get("/id", isTokenCorrect,  TeamsMiddleware.createTeams); 
pathRouter.get("/name", isTokenCorrect,  TeamsMiddleware.createTeams); 
pathRouter.get("/organization", isTokenCorrect,  TeamsMiddleware.createTeams); 
pathRouter.patch("/update", isTokenCorrect,  TeamsMiddleware.createTeams); 
pathRouter.delete("/delete", isTokenCorrect,  TeamsMiddleware.createTeams); 

export default baseRouter.use("/teams", pathRouter);

