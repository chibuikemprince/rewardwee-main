import { Router } from "express";

import { isTokenCorrect } from "../middlewares/header"; 
import TeamsMiddleware from "../middlewares/teams"

const pathRouter = Router();
const baseRouter = Router();


pathRouter.post("/create",  TeamsMiddleware.createTeams); 
pathRouter.get("/id",  TeamsMiddleware.getTeamsById); 
pathRouter.get("/name",  TeamsMiddleware.getTeamsByName); 
pathRouter.get("/organization",  TeamsMiddleware.getTeamsByCreators); 
pathRouter.patch("/update",  TeamsMiddleware.updateTeams); 
pathRouter.delete("/delete",  TeamsMiddleware.deleteTeam); 

export default baseRouter.use("/teams", isTokenCorrect, pathRouter);

