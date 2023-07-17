"use strict";
//get a user profile
// get all registered users, filter company, team, status, regDate
// update profile
// delete profile
// change password
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorReporting_1 = require("../helpers/errorReporting");
const mail_1 = require("../helpers/mail");
const misc_1 = require("../helpers/misc");
const external_1 = require("../databases/external");
const login_1 = require("../controllers/login");
class UserProfile {
    constructor() {
        console.log("user profile constructor called");
    }
    getProfile(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    external_1.UserModel.findOne({ _id: user_id }, { _id: 1, email: 1, company: 1, team: 1, firstName: 1, lastName: 1, status: 1, regDate: 1 })
                        .then((user) => {
                        if (user != null) {
                            // return user profile
                            console.log({ user });
                            /*
                            // all this verification should be handle by login script
                             if(user.status.toUpperCase()  != "ACTIVE"){
                            
                            reject({data: [], message: "account not active, please contact admin", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                            return;
                             }
                            
                             if(user.isEmailVerified != true && user.isPhoneNumberVerified != true){
                            reject({data: [], message: "account not verified, please verify your account", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                            return;
                            }
                            
                            
                             if(user.deleted == true){
                            reject({data: [], message: "user not found, account deleted", status: 404, statusCode: "RESOURCE_NOT_FOUND"})
                            return;
                             }
                            
                             */
                            let response = {
                                data: [user],
                                message: "user profile retrieved successfully",
                                status: 200,
                                statusCode: "SUCCESS"
                            };
                            resolve(response);
                            return;
                        }
                        else {
                            //user not found
                            let error_type = {
                                data: [],
                                message: "user not found",
                                status: 404,
                                statusCode: "RESOURCE_NOT_FOUND"
                            };
                            reject(error_type);
                            return;
                        }
                    })
                        .catch((err) => {
                        let error = {
                            status: "STRONG",
                            msg: `Redis client is not connected. Error: ${err.message}`,
                            class: "UserProfile",
                            time: new Date().toISOString(),
                            stack: err.stack
                        };
                        (0, errorReporting_1.LogError)(error);
                        let error_type = {
                            data: [],
                            message: "unknown error occurred, please try again.",
                            status: 500,
                            statusCode: "UNKNOWN_ERROR"
                        };
                        reject(error_type);
                        return;
                    });
                }
                catch (err) {
                    let error = {
                        status: "STRONG",
                        msg: `Redis client is not connected. Error: ${err.message}`,
                        class: "RedisClient",
                        time: new Date().toISOString()
                    };
                    (0, errorReporting_1.LogError)(error);
                    let error_type = {
                        data: [],
                        message: "unknown error occurred, please try again.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    };
                    reject(error_type);
                    return;
                }
            });
        });
    }
    getAllProfiles(skip) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    external_1.UserModel.find({ deleted: false }, { _id: 1, email: 1, company: 1, team: 1, firstName: 1, lastName: 1, status: 1, regDate: 1 }, { sort: { regDate: -1 }, skip, limit: 200 })
                        .then((users) => {
                        if (users.length > 0) {
                            let response = {
                                data: users,
                                message: "user profiles retrieved successfully",
                                status: 200,
                                statusCode: "SUCCESS"
                            };
                        }
                        else {
                            let error_type = {
                                data: [],
                                message: "no users found",
                                status: 404,
                                statusCode: "RESOURCE_NOT_FOUND"
                            };
                            reject(error_type);
                            return;
                        }
                    })
                        .catch((err) => {
                        let error = {
                            msg: `Error getting all profiles. Error: ${err.message}`,
                            status: "STRONG",
                            time: new Date().toISOString(),
                            stack: err.stack,
                            class: "UserProfile"
                        };
                        (0, errorReporting_1.LogError)(error);
                        let error_type = {
                            data: [],
                            message: "unknown error occurred, please try again.",
                            status: 500,
                            statusCode: "UNKNOWN_ERROR"
                        };
                        reject(error_type);
                        return;
                    });
                }
                catch (err) {
                    let error = {
                        msg: `Error getting all profiles. Error: ${err.message}`,
                        status: "STRONG",
                        time: new Date().toISOString(),
                        stack: err.stack,
                        class: "UserProfile"
                    };
                    (0, errorReporting_1.LogError)(error);
                    let error_type = {
                        data: [],
                        message: "unknown error occurred, please try again.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    };
                    reject(error_type);
                    return;
                }
            });
        });
    }
    filterUsers(filter, skip) {
        return new Promise((resolve, reject) => {
            try {
                /* email = email.toLowerCase()
               team = team.toLowerCase()
               firstName = firstName.toLowerCase()
               lastName = lastName.toLowerCase() */
                if (filter.email && filter.email != "") {
                    filter.email = filter.email.toLowerCase();
                }
                if (filter.team && filter.team != "") {
                    filter.team = filter.team.toLowerCase();
                }
                if (filter.firstName && filter.firstName != "") {
                    filter.firstName = filter.firstName.toLowerCase();
                }
                if (filter.lastName && filter.lastName != "") {
                    filter.lastName = filter.lastName.toLowerCase();
                }
                if (filter.company && filter.company != "") {
                    filter.company = filter.company.toLowerCase();
                }
                if (filter.hasOwnProperty("regDate_from")) {
                    filter.regDate = { $gte: filter.regDate_from, $lte: filter.regDate_to };
                    delete filter.regDate_from;
                    delete filter.regDate_to;
                }
                external_1.UserModel.find(filter, { _id: 1, email: 1, company: 1, team: 1, firstName: 1, lastName: 1, status: 1, regDate: 1 }, { sort: { regDate: -1 }, skip, limit: 200 })
                    .then((users) => {
                    if (users.length > 0) {
                        let response = {
                            data: users,
                            message: "user profiles retrieved successfully",
                            status: 200,
                            statusCode: "SUCCESS"
                        };
                        resolve(response);
                        return;
                    }
                    else {
                        let error_type = {
                            data: [],
                            message: "no users found",
                            status: 404,
                            statusCode: "RESOURCE_NOT_FOUND"
                        };
                        reject(error_type);
                        return;
                    }
                });
            }
            catch (err) {
                let error = {
                    msg: `Error getting all profiles. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toISOString(),
                    stack: err.stack,
                    class: "UserProfile"
                };
                (0, errorReporting_1.LogError)(error);
                let error_type = {
                    data: [],
                    message: "unknown error occurred, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                reject(error_type);
                return;
            }
        });
    }
    //update profile
    updateProfile(user_id, update) {
        return new Promise((resolve, reject) => {
            try {
                // remove any empty or null properties from the update object
                let new_update = update;
                let length = Object.keys(new_update).length;
                if (length == 0) {
                    let emptyUpdateDataError = {
                        data: [],
                        message: "update data cannot be empty",
                        status: 400,
                        statusCode: "FORM_REQUIREMENT_ERROR"
                    };
                    reject(emptyUpdateDataError);
                    return;
                }
                let count = 0;
                for (let key in new_update) {
                    if (key == "password") {
                        delete new_update[key];
                    }
                    if (key in ["email", "firstName", "lastName", "company", "team"]) {
                        new_update[key] = new_update[key].toString().toLowerCase();
                    }
                    if (new_update[key] === null || new_update[key] === undefined || new_update[key] === "") {
                        reject({
                            data: [],
                            message: `invalid update data, ${key} cannot be empty or null`,
                            status: 400,
                            statusCode: "BAD_REQUEST"
                        });
                        return;
                    }
                    count++;
                    if (count === length) {
                        external_1.UserModel.updateOne({ _id: user_id }, new_update)
                            .then((result) => {
                            if (result.modifiedCount > 0) {
                                let response = {
                                    data: [],
                                    message: "user profile updated successfully",
                                    status: 200,
                                    statusCode: "SUCCESS"
                                };
                                resolve(response);
                                return;
                            }
                            else {
                                let error_type = {
                                    data: [],
                                    message: "user profile not updated",
                                    status: 404,
                                    statusCode: "RESOURCE_NOT_FOUND"
                                };
                                reject(error_type);
                                return;
                            }
                        })
                            .catch((err) => {
                            let error = {
                                msg: `Error updating profile. Error: ${err.message}`,
                                status: "STRONG",
                                time: new Date().toISOString(),
                                stack: err.stack,
                                class: "UserProfile"
                            };
                            (0, errorReporting_1.LogError)(error);
                            let error_type = {
                                data: [],
                                message: "unknown error occurred, please try again.",
                                status: 500,
                                statusCode: "UNKNOWN_ERROR"
                            };
                            reject(error_type);
                            return;
                        });
                    }
                }
            }
            catch (err) {
                let error = {
                    msg: `Error updating profile. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toISOString(),
                    stack: err.stack,
                    class: "UserProfile"
                };
                (0, errorReporting_1.LogError)(error);
                let error_type = {
                    data: [],
                    message: "unknown error occurred, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                reject(error_type);
                return;
            }
        });
    }
    updatePassword(user_id, data) {
        return new Promise((resolve, reject) => {
            try {
                external_1.UserModel.findOne({ _id: user_id })
                    .then((user) => {
                    if (user) {
                        (0, misc_1.verifyPassword)(data.oldPassword, user.password)
                            .then((result) => {
                            if (result.statusCode === "SUCCESS") {
                                (0, misc_1.hashPassword)(data.newPassword)
                                    .then((hash) => {
                                    external_1.UserModel.updateOne({ _id: user_id }, { password: hash.data[0] })
                                        .then((result) => {
                                        if (result.modifiedCount > 0) {
                                            //send email to user
                                            let email_data = {
                                                detailType: "password_update",
                                                message: "Your password has been updated successfully",
                                                subject: "Password Update",
                                                receiver: user.email,
                                                type: "single-template",
                                                template: "CHANGE_PASSWORD",
                                            };
                                            (0, mail_1.sendEmail)(email_data)
                                                .then((result) => {
                                                if (result.statusCode === "SUCCESS") {
                                                    let response = {
                                                        data: [],
                                                        message: "user password updated successfully",
                                                        status: 200,
                                                        statusCode: "SUCCESS"
                                                    };
                                                    resolve(response);
                                                    return;
                                                }
                                                else {
                                                    let error_type = {
                                                        data: [],
                                                        message: "user password updated successfully, but email notification not sent",
                                                        status: 200,
                                                        statusCode: "SUCCESS"
                                                    };
                                                    reject(error_type);
                                                    return;
                                                }
                                            })
                                                .catch((err) => {
                                                let error = {
                                                    msg: `Error sending email. Error: ${err.message}`,
                                                    status: "STRONG",
                                                    time: new Date().toISOString(),
                                                    stack: err.stack,
                                                    class: "UserProfile"
                                                };
                                                (0, errorReporting_1.LogError)(error);
                                                let error_type = {
                                                    data: [],
                                                    message: "user password updated successfully, but email notification not sent",
                                                    status: 200,
                                                    statusCode: "SUCCESS"
                                                };
                                                reject(error_type);
                                                return;
                                            });
                                        }
                                        else {
                                            let error_type = {
                                                data: [],
                                                message: "user password not updated",
                                                status: 404,
                                                statusCode: "RESOURCE_NOT_FOUND"
                                            };
                                            reject(error_type);
                                            return;
                                        }
                                    })
                                        .catch((err) => {
                                        let error = {
                                            msg: `Error updating password. Error: ${err.message}`,
                                            status: "STRONG",
                                            time: new Date().toISOString(),
                                            stack: err.stack,
                                            class: "UserProfile"
                                        };
                                        (0, errorReporting_1.LogError)(error);
                                        let error_type = {
                                            data: [],
                                            message: "unknown error occurred, please try again.",
                                            status: 500,
                                            statusCode: "UNKNOWN_ERROR"
                                        };
                                        reject(error_type);
                                        return;
                                    });
                                })
                                    .catch((err) => {
                                    let error = {
                                        msg: `Error updating password. Error: ${err.message}`,
                                        status: "STRONG",
                                        time: new Date().toISOString(),
                                        stack: err.stack,
                                        class: "UserProfile"
                                    };
                                    (0, errorReporting_1.LogError)(error);
                                    let error_type = {
                                        data: [],
                                        message: "unknown error occurred, please try again.",
                                        status: 500,
                                        statusCode: "UNKNOWN_ERROR"
                                    };
                                    reject(error_type);
                                    return;
                                });
                            }
                            else {
                                let error_type = {
                                    data: [],
                                    message: "incorrect current password",
                                    status: 400,
                                    statusCode: "BAD_REQUEST"
                                };
                                reject(error_type);
                                return;
                            }
                        })
                            .catch((err) => {
                            let error = {
                                msg: `Error updating password. Error: ${err.message}`,
                                status: "STRONG",
                                time: new Date().toISOString(),
                                stack: err.stack,
                                class: "UserProfile"
                            };
                            (0, errorReporting_1.LogError)(error);
                            let error_type = {
                                data: [],
                                message: "unknown error occurred, please enter a valid current password.",
                                status: 500,
                                statusCode: "UNKNOWN_ERROR"
                            };
                            reject(error_type);
                            return;
                        });
                    }
                    else {
                        let error_type = {
                            data: [],
                            message: "account not found, please login to continue",
                            status: 404,
                            statusCode: "RESOURCE_NOT_FOUND"
                        };
                        reject(error_type);
                        return;
                    }
                })
                    .catch((err) => {
                    let error = {
                        msg: `Error updating password. Error: ${err.message}`,
                        status: "STRONG",
                        time: new Date().toISOString(),
                        stack: err.stack,
                        class: "UserProfile"
                    };
                    (0, errorReporting_1.LogError)(error);
                    let error_type = {
                        data: [],
                        message: "unknown error occurred, please ensure you are logged in.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    };
                    reject(error_type);
                    return;
                });
            }
            catch (err) {
                let error = {
                    msg: `Error updating password. Error: ${err.message}`,
                    status: "STRONG",
                    time: new Date().toISOString(),
                    stack: err.stack,
                    class: "UserProfile"
                };
                (0, errorReporting_1.LogError)(error);
                let error_type = {
                    data: [],
                    message: "unknown error occurred, please try again.",
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                reject(error_type);
                return;
            }
        });
    }
    DeleteAccount(user_id, token) {
        return new Promise((resolve, reject) => {
            try {
                external_1.UserModel.findOne({ _id: user_id })
                    .then((user) => {
                    if (user) {
                        external_1.UserModel.updateOne({ _id: user_id }, { deleted: true, deleted_at: Date.now() })
                            .then((result) => {
                            if (result.modifiedCount > 0) {
                                // logout user account
                                login_1.AuthLogin.logout(token)
                                    .then((outDone) => { })
                                    .catch((outDoneErr) => { });
                                let response = {
                                    data: [],
                                    message: "user account deleted successfully",
                                    status: 200,
                                    statusCode: "SUCCESS"
                                };
                                resolve(response);
                                return;
                            }
                            else {
                                let error_type = {
                                    data: [],
                                    message: "user account not deleted",
                                    status: 404,
                                    statusCode: "RESOURCE_NOT_FOUND"
                                };
                                reject(error_type);
                                return;
                            }
                        })
                            .catch((err) => {
                            let error = {
                                msg: `Error deleting user account. Error: ${err.message}`,
                                status: "STRONG",
                                time: new Date().toISOString(),
                                stack: err.stack,
                                class: "UserProfile"
                            };
                            (0, errorReporting_1.LogError)(error);
                            let error_type = {
                                data: [],
                                message: "unknown error occurred, please try again.",
                                status: 500,
                                statusCode: "UNKNOWN_ERROR"
                            };
                            reject(error_type);
                            return;
                        });
                    }
                    else {
                        let error_type = {
                            data: [],
                            message: "account not found, please login to continue",
                            status: 404,
                            statusCode: "RESOURCE_NOT_FOUND"
                        };
                        reject(error_type);
                        return;
                    }
                })
                    .catch((err) => {
                    let error = {
                        msg: `Error deleting user account. Error: ${err.message}`,
                        status: "STRONG",
                        time: new Date().toISOString(),
                        stack: err.stack,
                        class: "UserProfile"
                    };
                    (0, errorReporting_1.LogError)(error);
                    let error_type = {
                        data: [],
                        message: "unknown error occurred, please ensure you are logged in.",
                        status: 500,
                        statusCode: "UNKNOWN_ERROR"
                    };
                    reject(error_type);
                    return;
                });
            }
            catch (err) {
            }
        });
    }
}
exports.default = new UserProfile();
