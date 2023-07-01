"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getEnv_1 = require("./getEnv");
var DBURI = (0, getEnv_1.getEnv)('DB');
console.log({ DBURI });
if (process.env.APP_ENV == 'production') {
    DBURI = (0, getEnv_1.getEnv)('DB_PRODUCTION');
}
const startApp = (app, port) => {
    mongoose_1.default.set("strictQuery", false);
    /*
    When strict option is set to true, Mongoose will ensure that only the fields that are specified in your Schema will be saved in the database, and all other fields will not be saved (if some other fields are sent).
    */
    mongoose_1.default
        .connect(DBURI)
        .then((start) => {
        let serviceName = (0, getEnv_1.getEnv)("SERVICE_NAME");
        app.listen(port, () => {
            console.log({
                message: 'App is now running.',
                port,
                DBURI,
                app: `http://localhost:${port}/rewardwee/${serviceName}`
            });
        });
    })
        .catch((err) => {
        let myerr = {
            msg: 'Error found, app could not start',
            stack: err.stack,
            status: 'STRONG',
            time: new Date().toDateString(),
        };
        console.log({ myerr });
    });
};
exports.startApp = startApp;
