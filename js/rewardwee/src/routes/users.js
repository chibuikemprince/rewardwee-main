"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const regMiddleware_1 = __importDefault(require("../middlewares/regMiddleware"));
const loginMiddleware_1 = __importDefault(require("../middlewares/loginMiddleware"));
const header_1 = require("../middlewares/header");
const profileMiddleware_1 = __importDefault(require("../middlewares/profileMiddleware"));
const pathRouter = (0, express_1.Router)();
const baseRouter = (0, express_1.Router)();
pathRouter.post("/register", regMiddleware_1.default.register);
pathRouter.post("/account/activate/resendotp", regMiddleware_1.default.resendActivation);
pathRouter.patch("/account/activate", regMiddleware_1.default.activateAccount);
//login
pathRouter.post("/login", loginMiddleware_1.default.login);
//sendPasswordRecoveryCode
pathRouter.post("/password/recovery/otp", loginMiddleware_1.default.sendPasswordRecoveryCode);
pathRouter.put("/password/reset", loginMiddleware_1.default.resetPassword);
// get login records
pathRouter.post("/login/records", header_1.isTokenCorrect, loginMiddleware_1.default.getUserLoginRecords);
//logout
pathRouter.post("/logout", header_1.isTokenCorrect, loginMiddleware_1.default.logout);
// getUserProfile
pathRouter.get("/profile", header_1.isTokenCorrect, profileMiddleware_1.default.getUserProfile);
pathRouter.post("/search", header_1.isTokenCorrect, profileMiddleware_1.default.searchOtherUsers);
//updateProfileData
pathRouter.put("/profile/update", header_1.isTokenCorrect, profileMiddleware_1.default.updateProfileData);
pathRouter.delete("/profile/delete", header_1.isTokenCorrect, profileMiddleware_1.default.deleteAccount);
pathRouter.patch("/profile/changepassword", header_1.isTokenCorrect, profileMiddleware_1.default.updatePassword);
exports.default = baseRouter.use("/users", pathRouter);
