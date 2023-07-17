"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const env_1 = require("../../env");
const getEnv = (key) => {
    let val = env_1.ENV[key];
    // console.log({key, val:process.env[key]})
    return val;
};
exports.getEnv = getEnv;
