"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalEnv = void 0;
const env_1 = require("./env");
const getGlobalEnv = (key) => {
    let val = env_1.ENV[key];
    // console.log({key, val:process.env[key]})
    return val;
};
exports.getGlobalEnv = getGlobalEnv;
