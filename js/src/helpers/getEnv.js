"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const getEnv = (key) => {
    let val = process.env[key];
    // console.log({key, val:process.env[key]})
    return val;
};
exports.getEnv = getEnv;
