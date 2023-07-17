"use strict";
//login
//logout
//reset password
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLogin = void 0;
const external_1 = require("../databases/external");
const errorReporting_1 = require("../helpers/errorReporting");
const misc_1 = require("../helpers/misc");
const redis_1 = require("../helpers/redis");
const mail_1 = require("../helpers/mail");
const getEnv_1 = require("../helpers/getEnv");
class AuthLoginClass {
    constructor() {
        console.log("auth log constructor");
        this.resetPassword_Redis_Key = "reset_password_otp";
    }
    login(data) {
        return new Promise((resolve, reject) => {
            let { email, phoneNumber, password } = data;
            if (!email && !phoneNumber) {
                reject({
                    data: [],
                    message: "please enter email or phone number",
                    status: 403,
                    statusCode: "FORBIDDEN"
                });
                return;
            }
            else {
                if (!password) {
                    reject({
                        data: [],
                        message: "please enter password",
                        status: 403,
                        statusCode: "FORBIDDEN"
                    });
                    return;
                }
                // check if user is registered
                let key = email ? "email" : "phoneNumber";
                let filter = { [key]: email || phoneNumber };
                external_1.UserModel.findOne({ filter })
                    .then((user) => {
                    if (user === null) {
                        //usernot found
                        let response = {
                            data: [],
                            message: "user not found",
                            status: 404,
                            statusCode: "USER_NOT_FOUND"
                        };
                        reject(response);
                        return;
                    }
                    else {
                        if (user.status.toUpperCase() != "ACTIVE") {
                            reject({ data: [], message: "account not active, please contact admin", status: 404, statusCode: "RESOURCE_NOT_FOUND" });
                            return;
                        }
                        if (user.isEmailVerified != true && user.isPhoneNumberVerified != true) {
                            reject({ data: [], message: "account not verified, please verify your account.", status: 404, statusCode: "RESOURCE_NOT_FOUND" });
                            return;
                        }
                        if (user.deleted == true) {
                            reject({ data: [], message: "user not found, account deleted.", status: 404, statusCode: "RESOURCE_NOT_FOUND" });
                            return;
                        }
                        let currentPasswordTrial = user.passwordTrial;
                        currentPasswordTrial = Number.isNaN(Number(currentPasswordTrial)) ? 0 : currentPasswordTrial;
                        console.log({ currentPasswordTrial });
                        let envTrialLimit = (0, getEnv_1.getEnv)("MAX_PASSWORD_TRIAL");
                        if (currentPasswordTrial >= envTrialLimit) {
                            //LOGIN_FAILED
                            let trialResponse = {
                                data: [],
                                message: "you have exceeded the limit for failed login, kindly reset your password via password recovery.",
                                status: 429,
                                statusCode: "LOGIN_FAILED"
                            };
                            reject(trialResponse);
                            return;
                        }
                        (0, misc_1.verifyPassword)(password, user.password)
                            .then((Match) => {
                            if (Match.statusCode == "INCORRECT_PASSWORD") {
                                user.passwordTrial = currentPasswordTrial + 1;
                            }
                            else if (Match.statusCode == "SUCCESS") {
                                user.passwordTrial = 0;
                            }
                            user.save()
                                .then((saved) => { console.log({ saved }); })
                                .catch((savedError) => { console.log({ savedError }); });
                            let isMatch = Match.statusCode == "SUCCESS" ? true : false;
                            if (isMatch) {
                                //login successful
                                // generate token
                                let tokenpayload = {
                                    id: user._id,
                                    email: user.email,
                                    time: Date.now()
                                };
                                (0, misc_1.createJwtToken)(tokenpayload)
                                    .then((token) => {
                                    // save login info
                                    external_1.UserLoginRecord.updateMany({ user_id: user._id }, { status: "INACTIVE" })
                                        .then((done) => {
                                        console.log({
                                            user_id: user._id,
                                            done
                                        });
                                        external_1.UserLoginRecord.create({
                                            user_id: user._id, email: user.email, token, status: "ACTIVE"
                                        })
                                            .then((done) => {
                                            resolve({
                                                data: [{ token }],
                                                message: "login successful",
                                                status: 200,
                                                statusCode: "LOGIN_SUCCESSFUL"
                                            });
                                            return;
                                        })
                                            .catch((err) => {
                                            let error_log = {
                                                msg: `Error creating jwt token. Error: ${err.message}`,
                                                status: "STRONG",
                                                time: new Date().toUTCString(),
                                                stack: err.stack,
                                                class: this
                                            };
                                            (0, errorReporting_1.LogError)(error_log);
                                        });
                                    })
                                        .catch((err) => {
                                        let error_log = {
                                            msg: `Error updating user login status. Error: ${err.message}`,
                                            status: "STRONG",
                                            time: new Date().toUTCString(),
                                            stack: err.stack,
                                            class: this
                                        };
                                        (0, errorReporting_1.LogError)(error_log);
                                        let error_response = {
                                            data: [],
                                            message: "login not successful",
                                            status: 500,
                                            statusCode: "LOGIN_FAILED"
                                        };
                                        reject(error_response);
                                        return;
                                    });
                                })
                                    .catch((err) => {
                                    reject({
                                        data: [],
                                        message: "login not successful",
                                        status: 200,
                                        statusCode: "LOGIN_FAILED"
                                    });
                                    return;
                                });
                            }
                            else {
                                reject({
                                    data: [],
                                    message: "incorrect password",
                                    status: 403,
                                    statusCode: "FORBIDDEN"
                                });
                                return;
                            }
                        })
                            .catch((err) => {
                            let error_log = {
                                msg: `Error checking user password. Error: ${err.message}`,
                                status: "STRONG",
                                time: new Date().toUTCString(),
                                stack: err.stack,
                                class: this
                            };
                            (0, errorReporting_1.LogError)(error_log);
                            reject({
                                data: [],
                                message: "login failed",
                                status: 500,
                                statusCode: "UNKNOWN_ERROR"
                            });
                            return;
                        });
                    }
                })
                    .catch((err) => {
                    let error = {
                        msg: `Error login user. Error: ${err.message}`,
                        status: "STRONG",
                        time: new Date().toUTCString(),
                        stack: err.stack,
                        class: this
                    };
                    (0, errorReporting_1.LogError)(error);
                    reject(err);
                });
            }
        });
    }
    logout(token) {
        return new Promise((resolve, reject) => {
            external_1.UserLoginRecord.findOneAndUpdate({ token }, { status: "INACTIVE" })
                .then((done) => {
                resolve({
                    data: [],
                    message: "logout successful",
                    status: 200,
                    statusCode: "LOGOUT_SUCCESSFUL"
                });
                return;
            })
                .catch((err) => {
                let error_log = {
                    msg: `Error logging out user. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack,
                    class: this
                };
                (0, errorReporting_1.LogError)(error_log);
                reject({
                    data: [],
                    message: "logout not successful",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                });
                return;
            });
        });
    }
    forgot_password(email) {
        return new Promise((resolve, reject) => {
            external_1.UserModel.findOne({ email })
                .then((user) => {
                if (user === null) {
                    //user not found
                    reject({
                        data: [],
                        message: "user not found",
                        status: 404,
                        statusCode: "USER_NOT_FOUND"
                    });
                    return;
                }
                else {
                    //user found
                    //send email
                    //generate token
                    //save token
                    if (user.status.toUpperCase() != "ACTIVE") {
                        reject({ data: [], message: "account not active, please contact admin", status: 404, statusCode: "RESOURCE_NOT_FOUND" });
                        return;
                    }
                    if (user.isEmailVerified != true && user.isPhoneNumberVerified != true) {
                        reject({ data: [], message: "account not verified, please verify your account", status: 404, statusCode: "RESOURCE_NOT_FOUND" });
                        return;
                    }
                    if (user.deleted == true) {
                        reject({ data: [], message: "user not found, account deleted", status: 404, statusCode: "RESOURCE_NOT_FOUND" });
                        return;
                    }
                    // limit request
                    let key = `${email}-resetPassword_Redis_Key`;
                    let resendKey = `${key}-time`;
                    let failedKey = `${key}-failed`;
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
                            (0, misc_1.generateRandomString)((0, getEnv_1.getEnv)("OTP_LENGTH"))
                                .then((token) => {
                                //save token
                                let resettoken = token.data[0];
                                resettoken = resettoken.toUpperCase();
                                //save to redis
                                (0, redis_1.RedisSet)(key, resettoken)
                                    .then((done) => {
                                    // track number of failures to stop bruteforce
                                    (0, redis_1.RedisSet)(failedKey, 0)
                                        .then((failedCount) => { })
                                        .catch((failedCountErr) => { });
                                    // mark resend duration
                                    (0, redis_1.RedisSet)(resendKey, Date.now().toString())
                                        .then((resendKeyCount) => { })
                                        .catch((resendKeyCountErr) => { });
                                    //send email
                                    let email_data = {
                                        detailType: "password_reset",
                                        subject: "Password Reset",
                                        message: `Your password reset token is ${resettoken}`,
                                        type: "single-template",
                                        template: "PASSWORD_RESET_TOKEN",
                                        receiver: email,
                                        data: { code: resettoken }
                                    };
                                    (0, mail_1.sendEmail)(email_data)
                                        .then((done) => {
                                        resolve({
                                            data: [],
                                            message: "password reset token sent",
                                            status: 200,
                                            statusCode: "PASSWORD_RESET_TOKEN_SENT"
                                        });
                                        return;
                                    })
                                        .catch((err) => {
                                        let error_log = {
                                            msg: `Error sending email. Error: ${err.message}`,
                                            status: "STRONG",
                                            time: new Date().toUTCString(),
                                            stack: err.stack,
                                            class: this
                                        };
                                        (0, errorReporting_1.LogError)(error_log);
                                        reject({
                                            data: [],
                                            message: "password reset token not sent",
                                            status: 500,
                                            statusCode: "UNKNOWN_ERROR"
                                        });
                                        return;
                                    });
                                })
                                    .catch((err) => {
                                    let error_log = {
                                        msg: `Error saving token to redis. Error: ${err.message}`,
                                        status: "STRONG",
                                        time: new Date().toUTCString(),
                                        stack: err.stack,
                                        class: this
                                    };
                                    (0, errorReporting_1.LogError)(error_log);
                                    reject({
                                        data: [],
                                        message: "unknown error",
                                        status: 500,
                                        statusCode: "UNKNOWN_ERROR"
                                    });
                                    return;
                                });
                            })
                                .catch((err) => {
                                let error_log = {
                                    msg: `Error generating token. Error: ${err.message}`,
                                    status: "STRONG",
                                    time: new Date().toUTCString(),
                                    stack: err.stack,
                                    class: this
                                };
                                (0, errorReporting_1.LogError)(error_log);
                                reject({
                                    data: [],
                                    message: "unknown error",
                                    status: 500,
                                    statusCode: "UNKNOWN_ERROR"
                                });
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
                }
            })
                .catch((err) => {
                let error_log = {
                    msg: `Error finding user. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack,
                    class: this
                };
                (0, errorReporting_1.LogError)(error_log);
                reject({
                    data: [],
                    message: "unknown error",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                });
                return;
            });
        });
    }
    confirm_password_reset(email, token, newpassword) {
        return new Promise((resolve, reject) => {
            token = token.toUpperCase();
            let key = `${email}-resetPassword_Redis_Key`;
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
                    //check if token is valid
                    (0, redis_1.RedisGet)(key)
                        .then((redis_token) => {
                        if (redis_token != null && redis_token === token) {
                            //token is valid
                            //update password
                            //delete token from redis
                            //send email
                            (0, misc_1.hashPassword)(newpassword)
                                .then((hashData) => {
                                let hash = hashData.data[0];
                                external_1.UserModel.findOneAndUpdate({ email }, { password: hash })
                                    .then((done) => {
                                    // change passwordTrial to 0
                                    done.passwordTrial = 0;
                                    done.save()
                                        .then((saved) => { console.log({ saved }); })
                                        .catch((savedError) => { console.log({ savedError }); });
                                    //send email
                                    let email_data = {
                                        detailType: "password_reset",
                                        subject: "Password Reset",
                                        message: `Your password has been reset`,
                                        type: "single-template",
                                        template: "PASSWORD_RESET_SUCCESSFUL",
                                        receiver: email,
                                        data: { firstName: done.firstName, lastName: done.lastName }
                                    };
                                    (0, mail_1.sendEmail)(email_data)
                                        .then((done) => {
                                        resolve({
                                            data: [],
                                            message: "password reset successful",
                                            status: 200,
                                            statusCode: "PASSWORD_RESET_SUCCESSFUL"
                                        });
                                        return;
                                    })
                                        .catch((err) => {
                                        let error_log = {
                                            msg: `Error sending email. Error: ${err.message}`,
                                            status: "STRONG",
                                            time: new Date().toUTCString(),
                                            stack: err.stack,
                                            class: this
                                        };
                                        (0, errorReporting_1.LogError)(error_log);
                                        reject({
                                            data: [],
                                            message: "password reset successful but email not sent",
                                            status: 500,
                                            statusCode: "UNKNOWN_ERROR"
                                        });
                                        return;
                                    });
                                    //delete token from redis
                                    (0, redis_1.RedisDelete)(`${email}-resetPassword_Redis_Key`)
                                        .then((done) => {
                                        console.log({ info: `$email}-resetPassword_Redis_Key deleted from redis` });
                                    })
                                        .catch((err) => {
                                        let error_log = {
                                            msg: `Error deleting token from redis. Error: ${err.message}`,
                                            status: "STRONG",
                                            time: new Date().toUTCString(),
                                            stack: err.stack,
                                            class: this
                                        };
                                        (0, errorReporting_1.LogError)(error_log);
                                        reject({
                                            data: [],
                                            message: "unknown error",
                                            status: 500,
                                            statusCode: "UNKNOWN_ERROR"
                                        });
                                        return;
                                    });
                                })
                                    .catch((err) => {
                                    let error_log = {
                                        msg: `Error updating password. Error: ${err.message}`,
                                        status: "STRONG",
                                        time: new Date().toUTCString(),
                                        stack: err.stack,
                                        class: this
                                    };
                                    (0, errorReporting_1.LogError)(error_log);
                                    reject({
                                        data: [],
                                        message: "unknown error",
                                        status: 500,
                                        statusCode: "UNKNOWN_ERROR"
                                    });
                                    return;
                                });
                            })
                                .catch((err) => {
                                let error = {
                                    data: [],
                                    message: "unknown error occurred, please try again.",
                                    status: 500,
                                    statusCode: "FORM_REQUIREMENT_ERROR"
                                };
                                reject(error);
                                let error_log = {
                                    msg: err.message,
                                    status: "STRONG",
                                    time: new Date().toUTCString(),
                                    stack: "password reset failed, please try again.",
                                    class: this
                                };
                                (0, errorReporting_1.LogError)(error_log);
                                return;
                            });
                        }
                        else {
                            (0, redis_1.RedisSet)(failedKey, failed + 1)
                                .then((failedCount) => { })
                                .catch((failedCountErr) => { });
                            reject({
                                data: [],
                                message: redis_token == null ? "token expired, please request new token. " : "invalid token",
                                status: 400,
                                statusCode: "INVALID_TOKEN"
                            });
                            return;
                        }
                    })
                        .catch((err) => {
                        let error_log = {
                            msg: `Error getting token from redis. Error: ${err.message}`,
                            status: "STRONG",
                            time: new Date().toUTCString(),
                            stack: err.stack,
                            class: this
                        };
                        (0, errorReporting_1.LogError)(error_log);
                        reject({
                            data: [],
                            message: "unknown error",
                            status: 500,
                            statusCode: "UNKNOWN_ERROR"
                        });
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
    }
    getUserLoginRecords(user_id, skip, timeStart, timeStop) {
        return new Promise((resolve, reject) => {
            if (timeStart != null && timeStop != null) {
                //timeStart = 0;
                // timeStop = Date.now()
            }
            if (timeStart > timeStop || timeStop < timeStart) {
                reject({
                    data: [],
                    message: "invalid time range",
                    status: 400,
                    statusCode: "FORM_REQUIREMENT_ERROR"
                });
                return;
            }
            // console.log({$lte: timeStop, $gte: timeStart, skip})
            external_1.UserLoginRecord.find({ user_id, time: { $lte: timeStop, $gte: timeStart } }, null, { skip, limit: 200 })
                .then((records) => {
                if (records.length === 0) {
                    resolve({
                        data: [],
                        message: "no records found",
                        status: 200,
                        statusCode: "LOGIN_RECORDS_NOT_FOUND"
                    });
                    return;
                }
                else {
                    resolve({
                        data: records,
                        message: "records found",
                        status: 200,
                        statusCode: "LOGIN_RECORDS_FOUND"
                    });
                    return;
                }
            })
                .catch((err) => {
                let error_log = {
                    msg: `Error updating password. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack,
                    class: this
                };
                (0, errorReporting_1.LogError)(error_log);
                reject({
                    data: [],
                    message: "unknown error",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                });
                return;
            });
        });
    }
    getAllUsersLoginRecords(skip, timeStart, timeStop) {
        return new Promise((resolve, reject) => {
            if (timeStart != null && timeStop != null) {
                // timeStart = 0;
                // timeStop = Date.now()
            }
            if (timeStart > timeStop || timeStop < timeStart) {
                reject({
                    data: [],
                    message: "invalid time range",
                    status: 400,
                    statusCode: "FORM_REQUIREMENT_ERROR"
                });
                return;
            }
            external_1.UserLoginRecord.find({ time: { $lte: timeStop, $gte: timeStart } }, null, { skip, limit: 200 })
                .then((records) => {
                if (records.length === 0) {
                    resolve({
                        data: [],
                        message: "no records found",
                        status: 200,
                        statusCode: "LOGIN_RECORDS_NOT_FOUND"
                    });
                    return;
                }
                else {
                    resolve({
                        data: records,
                        message: "records found",
                        status: 200,
                        statusCode: "LOGIN_RECORDS_FOUND"
                    });
                    return;
                }
            })
                .catch((err) => {
                let error_log = {
                    msg: `Error updating password. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack,
                    class: this
                };
                (0, errorReporting_1.LogError)(error_log);
                reject({
                    data: [],
                    message: "unknown error",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                });
                return;
            });
        });
    }
    isUserLoggedIn(user_id, token) {
        return new Promise((resolve, reject) => {
            external_1.UserLoginRecord.findOne({ user_id, token, status: "ACTIVE" }, null)
                .then((records) => {
                if (records === null) {
                    reject({
                        data: [],
                        message: "user is not currently logged in",
                        status: 200,
                        statusCode: "LOGIN_FAILED"
                    });
                    return;
                }
                else {
                    resolve({
                        data: records,
                        message: "user is logged in",
                        status: 200,
                        statusCode: "LOGIN_SUCCESSFUL"
                    });
                    return;
                }
            })
                .catch((err) => {
                let error_log = {
                    msg: `Error updating password. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack,
                    class: this
                };
                (0, errorReporting_1.LogError)(error_log);
                reject({
                    data: [],
                    message: "unknown error",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                });
                return;
            });
        });
    }
}
exports.AuthLogin = new AuthLoginClass();
