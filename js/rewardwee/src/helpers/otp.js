"use strict";
// import redis module to save otp
// import { redis } from "../config/redis";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmOtp = exports.sendOtp = void 0;
const errorReporting_1 = require("./errorReporting");
const mail_1 = require("./mail");
const redis_1 = require("./redis");
const getEnv_1 = require("./getEnv");
const sendOtp = (data, otp) => {
    return new Promise((resolve, reject) => {
        const { receiver, message, template, subject, type, detailType } = data;
        //save to redis
        let key = `${receiver}-activation-otp`;
        let failedKey = `${key}-failed`;
        otp = otp.toUpperCase();
        console.log({ otp });
        let resendKey = `${key}-time`;
        (0, redis_1.RedisGet)(resendKey)
            .then((resendTime) => {
            resendTime = resendTime ? resendTime : 0;
            let resendDuration = (0, getEnv_1.getEnv)("OTP_RESEND_DURATION");
            let now = Date.now();
            let diff = now - resendTime;
            diff = diff / 60000;
            if (diff < resendDuration) {
                let remaininDuration = resendDuration - diff;
                let response = {
                    data: [{ time_left: `${remaininDuration.toString().substr(0, 3)} mins` }],
                    message: `otp can only be resent after ${resendDuration} mins.`,
                    status: 403,
                    statusCode: "FORBIDDEN"
                };
                reject(response);
                return;
            }
            else {
                (0, redis_1.RedisSet)(key, otp)
                    .then((done) => {
                    console.log("otp saved to redis");
                    // send otp to receiver
                    //mark failed trials
                    (0, redis_1.RedisSet)(failedKey, 0)
                        .then((failedCount) => { })
                        .catch((failedCountErr) => { });
                    // mark resend duration
                    (0, redis_1.RedisSet)(resendKey, Date.now().toString())
                        .then((resendKeyCount) => { })
                        .catch((resendKeyCountErr) => { });
                    (0, mail_1.sendEmail)(data)
                        .then((done) => {
                        resolve(done);
                        return;
                    })
                        .catch((err) => {
                        let error = {
                            msg: `Error sending otp. Error: ${err.message}`,
                            status: "STRONG",
                            time: new Date().toUTCString(),
                            stack: err.stack,
                            class: this
                        };
                        (0, errorReporting_1.LogError)(error);
                        let failedToSendOtp = {
                            data: [],
                            message: "otp not sent successfully, please try again.",
                            status: 500,
                            statusCode: "UNKNOWN_ERROR"
                        };
                        reject(failedToSendOtp);
                        return;
                    });
                    let sent = {
                        data: [],
                        message: "otp sent successfully.",
                        status: 200,
                        statusCode: "SUCCESS"
                    };
                    resolve(done);
                    return;
                })
                    .catch((err) => {
                    let error = {
                        msg: `Error saving otp to redis. Error: ${err.message}`,
                        status: "STRONG",
                        time: new Date().toUTCString(),
                        stack: err.stack,
                        class: this
                    };
                    (0, errorReporting_1.LogError)(error);
                    let failedToSaveToRedis = {
                        data: [],
                        message: "otp not sent successfully, please try again.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    };
                    reject(failedToSaveToRedis);
                    return;
                });
            }
        })
            .catch((err) => {
            let error = {
                msg: `Error getting otp resend duration from redis. Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack,
                class: this
            };
            (0, errorReporting_1.LogError)(error);
            let failedToGetResendDuration = {
                data: [],
                message: "otp not sent successfully, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            };
            reject(failedToGetResendDuration);
            return;
        });
    });
};
exports.sendOtp = sendOtp;
const confirmOtp = (data) => {
    return new Promise((resolve, reject) => {
        let { email, otp } = data;
        otp = otp.toUpperCase();
        let key = `${email}-activation-otp`;
        let failedKey = `${key}-failed`;
        //check the number of otp failures/ wrong otp trials
        (0, redis_1.RedisGet)(failedKey)
            .then((failed) => {
            failed = failed ? failed : 0;
            let max_otp_failure = (0, getEnv_1.getEnv)("MAX_OTP_FAILURE");
            if (failed >= max_otp_failure) {
                let response = {
                    data: [],
                    message: "otp failed too many times, please request for new otp.",
                    status: 403,
                    statusCode: "FORBIDDEN"
                };
                reject(response);
                return;
            }
            else {
                // check if otp is valid
                (0, redis_1.RedisGet)(key)
                    .then((myotp) => {
                    if (myotp == otp) {
                        let response = {
                            data: [],
                            message: "otp confirmed successfully.",
                            status: 200,
                            statusCode: "SUCCESS"
                        };
                        resolve(response);
                        return;
                    }
                    else {
                        (0, redis_1.RedisSet)(failedKey, failed + 1)
                            .then((failedCount) => { })
                            .catch((failedCountErr) => { });
                        let response = {
                            data: [],
                            message: "your otp is incorrect.",
                            status: 403,
                            statusCode: "FORBIDDEN"
                        };
                        reject(response);
                        return;
                    }
                })
                    .catch((err) => {
                    let error = {
                        msg: `Error getting otp from redis. Error: ${err.message}`,
                        status: "STRONG",
                        time: new Date().toUTCString(),
                        stack: err.stack,
                        class: this
                    };
                    (0, errorReporting_1.LogError)(error);
                    let failedToGetFromRedis = {
                        data: [],
                        message: "otp not fetched successfully, please try again.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    };
                    resolve(failedToGetFromRedis);
                    return;
                });
            }
        })
            .catch((err) => {
            let error = {
                msg: `Error getting otp failed count from redis. Error: ${err.message}`,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack,
                class: this
            };
            (0, errorReporting_1.LogError)(error);
            let response = {
                data: [],
                message: "otp not confirmed successfully, please try again.",
                status: 403,
                statusCode: "UNKNOWN_ERROR"
            };
            reject(response);
            return;
        });
    });
};
exports.confirmOtp = confirmOtp;
