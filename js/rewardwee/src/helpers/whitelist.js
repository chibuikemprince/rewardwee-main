"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whitelistOrigin = void 0;
const getEnv_1 = require("./getEnv");
const env = process.env;
const prodOrigin = [];
const devOrigin = [
    `http://127.0.0.1:${process.env["PORT"]}`,
    `http://localhost:${process.env["PORT"]}`,
    'http://localhost:5004',
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:4000',
    'https://localhost:5004',
    'https://localhost:3001',
    'https://localhost:3000',
    'https://localhost:4000',
    '[::1]:3001',
    '[::1]:3000',
];
let mywhitelistOrigin = (0, getEnv_1.getEnv)("ENV") === 'production' ? prodOrigin : devOrigin;
exports.whitelistOrigin = mywhitelistOrigin;
