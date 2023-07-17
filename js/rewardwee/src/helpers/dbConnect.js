"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getEnv_1 = require("./getEnv");
var DBURI = (0, getEnv_1.getEnv)('DB');
if (process.env.APP_ENV == 'production') {
    DBURI = (0, getEnv_1.getEnv)('DB_PRODUCTION');
}
// Mongoose connection options
const mongooseOptions = {
    autoIndex: true,
    autoCreate: true
};
const startApp = (app, port) => {
    mongoose_1.default.set("strictQuery", false);
    /*
  
    When strict option is set to true,
    Mongoose will ensure that only the fields that are specified in your Schema will be saved
    in the database, and all other fields will not be saved (if some other fields are sent).
  
    */
    mongoose_1.default
        .connect(DBURI, mongooseOptions)
        .then((done) => {
        let serviceName = (0, getEnv_1.getEnv)("SERVICE_NAME");
        app.listen(port, () => {
            console.log({
                message: 'App is now running.',
                port,
                DBURI,
                serviceName,
                app: `http://localhost:${port}/rewardwee/${serviceName}`,
                time: new Date().toDateString()
            });
        });
        const db = mongoose_1.default.connection;
        // Handle disconnection event
        db.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
        // Close the connection when the node process ends
        const readyState = mongoose_1.default.connection.readyState;
        console.log({ readyState });
    })
        .catch((err) => {
        let myerr = {
            msg: 'Error found, app could not start, db connection failed',
            stack: err.stack,
            status: 'STRONG',
            time: new Date().toDateString(),
        };
        console.log({ myerr });
    });
};
exports.startApp = startApp;
