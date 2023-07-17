"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendActivationCode = exports.activateAccount = exports.formReg = void 0;
const errorReporting_1 = require("../helpers/errorReporting");
const external_1 = require("../databases/external");
const misc_1 = require("../helpers/misc");
const otp_1 = require("../helpers/otp");
const mongoose_1 = __importDefault(require("mongoose"));
const getEnv_1 = require("../helpers/getEnv");
const mail_1 = require("../helpers/mail");
const formReg = (data) => {
    return new Promise((resolve, reject) => {
        let { email, password, company, team, firstName, lastName } = data;
        email = email.toLowerCase();
        company = company.toLowerCase();
        team = team.toLowerCase();
        firstName = firstName.toLowerCase();
        lastName = lastName.toLowerCase();
        //  email, password, company and firstname must be set.
        if (!email || !password || !company || !firstName || !team) {
            let error = {
                data: [],
                message: "Enter all required parameter.",
                status: 400,
                statusCode: "FORM_REQUIREMENT_ERROR"
            };
            reject(error);
            return;
        }
        const readyState = mongoose_1.default.connection.readyState;
        // console.log({dbConnection: readyState, email }) ;
        // checking user exist 
        external_1.UserModel.findOne({ email })
            .then((oldUser) => {
            try {
                if (oldUser) {
                    let error = {
                        data: [],
                        message: 'User with this email already exist. ',
                        status: 409,
                        statusCode: "RESOURCE_ALREADY_EXIST"
                    };
                    reject(error);
                    return;
                }
                else {
                    // creating new user
                    (0, misc_1.hashPassword)(password)
                        .then((hashData) => {
                        let hash = hashData.data[0];
                        external_1.UserModel.create({ email, firstName, lastName, company, team, password: hash })
                            .then((newUser) => {
                            (0, misc_1.generateRandomString)((0, getEnv_1.getEnv)("ACCOUNT_ACTIVATION_OTP_LENGTH"))
                                .then((otp_data) => {
                                let otp = otp_data.data[0];
                                otp = otp.toUpperCase();
                                let emailData = {
                                    message: `Your otp is ${otp}`,
                                    receiver: email,
                                    subject: "Otp for account activation",
                                    template: "ACCOUNT_ACTIVATION",
                                    type: "single-template",
                                    detailType: "account_activation",
                                    data: { code: otp }
                                };
                                (0, otp_1.sendOtp)(emailData, otp)
                                    .then((done) => {
                                    let success = {
                                        data: [{
                                                email: newUser.email
                                            }],
                                        message: "Account created successfully, kindly activate your account with the code sent to your email.",
                                        status: 200,
                                        statusCode: "SUCCESS"
                                    };
                                    resolve(success);
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
                                    reject(err);
                                    return;
                                });
                            })
                                .catch((err) => {
                                let error = {
                                    msg: `Error generating otp. Error: ${err.message}`,
                                    status: "STRONG",
                                    time: new Date().toUTCString(),
                                    stack: err.stack,
                                    class: this
                                };
                                (0, errorReporting_1.LogError)(error);
                                reject(err);
                                return;
                            });
                            //
                            /*
                            
                                            let done: RESPONSE_TYPE = {
                                                data: [],
                                                message: "Account created successfully, kindly activate your account with the link sent to your email.",
                                                status: 200,
                                                statusCode: "SUCCESS"
                                                 }
                                                    resolve(done);
                                                    return;
                            
                            
                                                     */
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
                            stack: "User not created successfully.",
                            class: this
                        };
                        (0, errorReporting_1.LogError)(error_log);
                        return;
                    });
                }
            }
            catch (err) {
                // res.status(500).send({error, message : "There was an Error"}) 
                let error = {
                    data: [],
                    message: "unknown error occurred, please try again.",
                    status: 500,
                    statusCode: "FORM_REQUIREMENT_ERROR"
                };
                // console.log({err})
                let error_type = {
                    msg: err.message,
                    status: "STRONG",
                    time: new Date().toUTCString(),
                    stack: err.stack,
                    class: this
                };
                (0, errorReporting_1.LogError)(error_type);
                reject(error);
                return;
            }
        })
            /*
                   
             */
            .catch((err) => {
            //  console.log({err})
            let error = {
                data: [],
                message: "unknown error occurred, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            };
            let error_type = {
                msg: err.message,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack,
                class: this
            };
            (0, errorReporting_1.LogError)(error_type);
            reject(error);
            return;
        });
    });
};
exports.formReg = formReg;
const activateAccount = (data) => {
    return new Promise((resolve, reject) => {
        let { email, otp } = data;
        if (!email || !otp) {
            let error = {
                data: [],
                message: "Enter all required parameter.",
                status: 400,
                statusCode: "FORM_REQUIREMENT_ERROR"
            };
            reject(error);
            return;
        }
        else {
            (0, otp_1.confirmOtp)(data)
                .then((done) => {
                external_1.UserModel.findOneAndUpdate({ email, isEmailVerified: false }, { isEmailVerified: true, emailVerifiedAt: new Date() }, { new: true })
                    .then((updatedData) => {
                    // console.log({updated: done})
                    if (updatedData.isEmailVerified == false) {
                        let error = {
                            data: [],
                            message: "Account activation failed, please try again.",
                            status: 500,
                            statusCode: "UNKNOWN_ERROR"
                        };
                        reject(error);
                        return;
                    }
                    else {
                        let done = {
                            data: [],
                            message: "Account activated successfully.",
                            status: 200,
                            statusCode: "SUCCESS"
                        };
                        let emailData = {
                            message: `Your account has been activated successfully.`,
                            receiver: email,
                            subject: "Account activation successful",
                            template: "ACCOUNT_ACTIVATION_SUCCESS",
                            type: "single-template",
                            detailType: "account_activation",
                            data: { firstName: updatedData.firstName, lastName: updatedData.lastName, email: updatedData.email }
                        };
                        (0, mail_1.sendEmail)(emailData)
                            .then((done) => {
                            //console.log({done})
                        })
                            .catch((err) => {
                            // console.log({err})
                        });
                        resolve(done);
                        return;
                    }
                })
                    .catch((err) => {
                    let activationFailed = {
                        data: [],
                        message: "Account activation failed.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    };
                    reject(activationFailed);
                    return;
                });
            })
                .catch((err) => {
                reject(err);
                return;
            });
        }
    });
};
exports.activateAccount = activateAccount;
const resendActivationCode = (email) => {
    return new Promise((resolve, reject) => {
        //check if user already registered and not activated
        external_1.UserModel.findOne({ email, isEmailVerified: false })
            .then((user) => {
            if (user === null) {
                let error = {
                    data: [],
                    message: "Seems you have activated your account already, kindly login or have not yet registered.",
                    status: 400,
                    statusCode: "ACCOUNT_ACTIVATED_ALREADY"
                };
                reject(error);
                return;
            }
            else {
                (0, misc_1.generateRandomString)((0, getEnv_1.getEnv)("ACCOUNT_ACTIVATION_OTP_LENGTH"))
                    .then((otp_data) => {
                    let otp = otp_data.data[0];
                    otp = otp.toUpperCase();
                    let emailData = {
                        message: `Your otp is ${otp}`,
                        receiver: email,
                        subject: "Otp for account activation",
                        template: "ACCOUNT_ACTIVATION",
                        type: "single-template",
                        detailType: "account_activation",
                        data: { code: otp }
                    };
                    (0, otp_1.sendOtp)(emailData, otp)
                        .then((done) => {
                        let success = {
                            data: [{
                                    email
                                }],
                            message: "Otp sent successfully, kindly activate your account with the code sent to your email.",
                            status: 200,
                            statusCode: "SUCCESS"
                        };
                        resolve(success);
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
                        reject(err);
                        return;
                    });
                })
                    .catch((err) => {
                    let error = {
                        msg: `Error generating otp. Error: ${err.message}`,
                        status: "STRONG",
                        time: new Date().toUTCString(),
                        stack: err.stack,
                        class: this
                    };
                    (0, errorReporting_1.LogError)(error);
                    reject(err);
                    return;
                });
            }
        })
            .catch((err) => {
            let error = {
                data: [],
                message: "unknown error occurred, please try again.",
                status: 500,
                statusCode: "UNKNOWN_ERROR"
            };
            let error_type = {
                msg: err.message,
                status: "STRONG",
                time: new Date().toUTCString(),
                stack: err.stack,
                class: this
            };
            (0, errorReporting_1.LogError)(error_type);
            reject(error);
            return;
        });
    });
};
exports.resendActivationCode = resendActivationCode;
/*

formReg({
    "firstName":"Prince",
    "lastName": "Chisomaga",
    "email":"youngprince042@gmail.com",
    "phoneNumber":"+2348066934496",
    "password":"123456",
    "company":"rewardwee",
    "team": "enginerring"

    
})
.then((done: any)=>{
    console.log(done)
}
)
.catch((err: any)=>{
console.log(err)
}) */
