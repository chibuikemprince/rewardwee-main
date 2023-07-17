"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenContent = exports.createJwtToken = exports.verifyPassword = exports.hashPassword = exports.generateRandomString = exports.response = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "../../.env"
});
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const modules_1 = require("../modules");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errorReporting_1 = require("./errorReporting");
const stream_1 = require("stream");
/**
 * A function that returns http response as a stream.
 *
 * @param res - response object.
 *
 * @param data - data to be sent as response.
 *
 * @returns - a void promise.
 *
 * @remarks - this function is used to send response to the client.
 *
 * @beta
 *
 *
 *
 */
const response = (res, data) => {
    data.status =
        data.status == undefined || data.status == null ? 500 : data.status;
    let dataToJson = JSON.stringify(data);
    //res.status(data.status).json(data);
    res.writeHead(data.status, {
        'Content-Length': Buffer.byteLength(dataToJson),
        'Content-Type': 'application/json'
    });
    var stream = new stream_1.Readable();
    stream.push(dataToJson); // stream apparently does not accept objects
    stream.push(null); // this 
    stream.pipe(res);
    return;
};
exports.response = response;
// function to generate random string
/**
 * A function that generates a random string of a given length.
 *
 * @param length  - length of the string to be generated.
 * @returns - a promise that resolves to a RESPONSE_TYPE object.
 */
const generateRandomString = (length) => {
    return new Promise((resolve, reject) => {
        try {
            let result = "";
            let characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            let done = {
                data: [result],
                message: "random string generated.",
                status: 200,
                statusCode: "SUCCESS"
            };
            resolve(done);
            return;
        }
        catch (err) {
            let error_type = {
                msg: err.msg,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack,
                class: this
            };
            (0, errorReporting_1.LogError)(error_type);
            let error = {
                data: [],
                message: "unknown error occurred, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            return;
        }
    });
};
exports.generateRandomString = generateRandomString;
/* hashing password */
// function to hash password
/**
 * A function that hashes a given password.
 *
 * @param password  - password to be hashed.
 * @returns - a promise that resolves to a RESPONSE_TYPE object.
 *
 * @remarks
 * This function uses the bcryptjs library to hash the password.
 *
 * @beta
 *
 * @example
 *
 * hashPassword("password")
 * .then((done: RESPONSE_TYPE)=>{
 * console.log(done);
 * })
 * .catch((err: RESPONSE_TYPE)=>{
 * console.log(err);
 * })
 *
 */
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            bcryptjs_1.default.genSalt(10)
                .then((salt) => {
                bcryptjs_1.default.hash(password, salt)
                    .then((hash) => {
                    let done = {
                        data: [hash],
                        message: "password hashed.",
                        status: 200,
                        statusCode: "SUCCESS"
                    };
                    resolve(done);
                });
            });
        }
        catch (err) {
            let error = {
                data: [],
                message: "unknown error occurred, please try again.",
                status: 500,
                statusCode: "FORM_REQUIREMENT_ERROR"
            };
            let error_type = {
                msg: err.msg,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack,
                class: this
            };
            (0, errorReporting_1.LogError)(error_type);
            reject(error);
            return;
        }
    });
};
exports.hashPassword = hashPassword;
// function to verify if hash matches password
/**
 * A function that verifies if a given password matches a given hash.
 *
 *
 * @param password  - password to be verified.
 * @param hash  - hash to be verified.
 * @returns - a promise that resolves to a RESPONSE_TYPE object.
 *
 * @remarks
 * This function uses the bcryptjs library to verify the password.
 *
 * @beta
 *
 * @example
 *
 * verifyPassword("password", "hash")
 * .then((done: RESPONSE_TYPE)=>{
 * console.log(done);
 * })
 * .catch((err: RESPONSE_TYPE)=>{
 * console.log(err);
 * })
 *
 */
const verifyPassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        try {
            bcryptjs_1.default.compare(password, hash)
                .then((match) => {
                if (match) {
                    let done = {
                        data: [match],
                        message: "password verified.",
                        status: 200,
                        statusCode: "SUCCESS"
                    };
                    resolve(done);
                }
                else {
                    let done = {
                        data: [match],
                        message: "incorrect password.",
                        status: 400,
                        statusCode: "INCORRECT_PASSWORD"
                    };
                    resolve(done);
                }
            });
        }
        catch (err) {
            let error = {
                data: [],
                message: "unknown error occurred, please try again.",
                status: 500,
                statusCode: "FORM_REQUIREMENT_ERROR"
            };
            let error_type = {
                msg: err.msg,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack,
                class: this
            };
            (0, errorReporting_1.LogError)(error_type);
            reject(error);
            return;
        }
    });
};
exports.verifyPassword = verifyPassword;
/* hashing password done */
/**
 * A function that creates a jwt token.
 *
 * @param payload  - payload to be used in creating the token.
 * @returns - a promise that resolves to a string.
 *
 * @remarks
 *
 * This function uses the jsonwebtoken library to create the token.
 *
 * @beta
 *
 * @example
 *
 *
 * createJwtToken(payload)
 * .then((token: string)=>{
 * console.log(token);
 * })
 * .catch((err: any)=>{
 * console.log(err);
 * })
 *
 */
const createJwtToken = (payload) => {
    return new Promise((resolve, reject) => {
        let secret = (0, modules_1.getGlobalEnv)("JWT_SECRET");
        //console.log({secret})
        const token = jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: '24h'
        });
        resolve(token);
    });
};
exports.createJwtToken = createJwtToken;
/**
 * A function that extracts the content of a jwt token.
 *
 * @param token  - token to be extracted.
 * @returns - a promise that resolves to a RESPONSE_TYPE object.
 *
 *
 * @remarks
 *
 * This function uses the jsonwebtoken library to extract the content of the token.
 *
 * @beta
 *
 * @example
 *
 *
 * extractTokenContent(token)
 * .then((done: RESPONSE_TYPE)=>{
 * console.log(done);
 * })
 * .catch((err: any)=>{
 * console.log(err);
 * })
 *
 */
const extractTokenContent = (token) => {
    let secret = (0, modules_1.getGlobalEnv)("JWT_SECRET");
    return new Promise((resolve, reject) => {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (decoded && typeof decoded === 'object' && 'id' in decoded && 'email' in decoded && 'time' in decoded) {
                let token = {
                    id: decoded.id,
                    email: decoded.email,
                    time: decoded.time
                };
                let done = {
                    data: [token],
                    message: "token verified.",
                    status: 200,
                    statusCode: "SUCCESS"
                };
                resolve(done);
                return;
            }
        }
        catch (err) {
            let error = {
                data: [],
                message: 'Failed to verify JWT token',
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            return;
        }
    });
};
exports.extractTokenContent = extractTokenContent;
/* jwt done */
