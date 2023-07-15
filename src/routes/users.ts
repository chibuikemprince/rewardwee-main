import { Router } from "express";

import RegistrationMiddleware from "../middlewares/regMiddleware";
import loginMiddleware from "../middlewares/loginMiddleware";
import { isTokenCorrect } from "../middlewares/header";
import profileMiddleware from "../middlewares/profileMiddleware";

const pathRouter = Router();
const baseRouter = Router();

pathRouter.post("/register",  RegistrationMiddleware.register);
pathRouter.post("/account/activate/resendotp",  RegistrationMiddleware.resendActivation);
pathRouter.patch("/account/activate",  RegistrationMiddleware.activateAccount);




//login
pathRouter.post("/login",  loginMiddleware.login); 
 
//sendPasswordRecoveryCode
pathRouter.post("/password/recovery/otp",  loginMiddleware.sendPasswordRecoveryCode); 


pathRouter.put("/password/reset",  loginMiddleware.resetPassword); 


// get login records
pathRouter.post("/login/records", isTokenCorrect,  loginMiddleware.getUserLoginRecords); 



//logout
pathRouter.post("/logout", isTokenCorrect,  loginMiddleware.logout); 




// getUserProfile
pathRouter.get("/profile", isTokenCorrect,  profileMiddleware.getUserProfile); 


pathRouter.post("/search", isTokenCorrect,  profileMiddleware.searchOtherUsers); 


//updateProfileData
pathRouter.put("/profile/update", isTokenCorrect,  profileMiddleware.updateProfileData); 
pathRouter.delete("/profile/delete", isTokenCorrect,  profileMiddleware.deleteAccount); 
pathRouter.patch("/profile/changepassword", isTokenCorrect,  profileMiddleware.updatePassword); 

export default baseRouter.use("/users", pathRouter);

