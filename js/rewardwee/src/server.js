"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConnect_1 = require("./helpers/dbConnect");
const app_1 = __importDefault(require("./app"));
const getEnv_1 = require("./helpers/getEnv");
const errorReporting_1 = require("./helpers/errorReporting");
//"./api/helpers/dbConnect";
process.on("uncaughtException", (err) => {
    //
    let error = {
        msg: "uncaughtException error found",
        stack: err.stack,
        status: "STRONG",
        time: new Date().toDateString()
    };
    (0, errorReporting_1.LogError)(error);
});
//RESPONSE_TYPE
let port = (0, getEnv_1.getEnv)("PORT");
(0, dbConnect_1.startApp)(app_1.default, port);
