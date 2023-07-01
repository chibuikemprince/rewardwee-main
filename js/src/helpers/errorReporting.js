"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogError = void 0;
// import Logger from "logger";
// import pino from  'pino'
const path_1 = __importDefault(require("path"));
const fatalLogPath = path_1.default.resolve(__dirname, '../io/error');
const LogError = (err) => {
    //'fatal', 'error', 'warn', 'info', 'debug'
    let loggerOrder = 'warn';
    if (err.status == 'STRONG') {
        loggerOrder = 'fatal';
    }
    else if (err.status == 'INFO') {
        loggerOrder = 'info';
    }
    console.log(err);
    return;
};
exports.LogError = LogError;
