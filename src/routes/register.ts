import { Router } from "express";

import RegistrationMiddleware from "../middlewares/regMiddleware";

const pathRouter = Router();
const baseRouter = Router();

pathRouter.post("/users/register",  RegistrationMiddleware.register);
pathRouter.post("/users/account/activate/resendotp",  RegistrationMiddleware.resendActivation);
pathRouter.patch("/users/account/activate",  RegistrationMiddleware.activateAccount);

export default baseRouter.use("/auth", pathRouter);

