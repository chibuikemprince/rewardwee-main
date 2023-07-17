"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_1 = __importDefault(require("../controllers/profile"));
const ProfileSchema = __importStar(require("../middlewares/schemas/profile"));
const misc_1 = require("../helpers/misc");
class ProfileMiddleware {
    constructor() {
        this.getUserProfile = (req, res, next) => {
            try {
                profile_1.default.getProfile(req.user_id)
                    .then((data) => {
                    (0, misc_1.response)(res, data);
                    return;
                })
                    .catch((err) => {
                    (0, misc_1.response)(res, err);
                    return;
                });
            }
            catch (err) {
                let feedback = {
                    message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
                    data: [],
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                (0, misc_1.response)(res, feedback);
                return;
            }
        };
        this.searchOtherUsers = (req, res, next) => {
            try {
                if (!req.body.hasOwnProperty("searchParams") || typeof req.body.searchParams != "object" || Object.entries(req.body.searchParams).length == 0) {
                    let errResponse = {
                        data: [],
                        message: "No search parameters were provided",
                        status: 400,
                        statusCode: "BAD_REQUEST"
                    };
                    (0, misc_1.response)(res, errResponse);
                    return;
                }
                ProfileSchema.searchUsersProfileSchema.validateAsync(req.body.searchParams)
                    .then((data) => {
                    //skip: number, timeStart: number, timeStop: number
                    if (req.body.skip == undefined || Number.isNaN(Number(req.body.skip))) {
                        req.body.skip = 0;
                    }
                    profile_1.default.filterUsers(data, req.body.skip)
                        .then((data) => {
                        (0, misc_1.response)(res, data);
                        return;
                    })
                        .catch((err) => {
                        (0, misc_1.response)(res, err);
                        return;
                    });
                })
                    .catch((err) => {
                    console.log({ err, d: err.details[0] });
                    err.details[0].message = err.details[0].message.replace(/"/g, "");
                    if (err.details[0].message.includes("fails to match the required pattern")) {
                        err.details[0].message = `Invalid ${err.details[0].context.key}`;
                    }
                    let feedback = {
                        message: err.details[0].message,
                        data: err.details,
                        status: 400,
                        statusCode: "FORM_REQUIREMENT_ERROR"
                    };
                    (0, misc_1.response)(res, feedback);
                    return;
                });
            }
            catch (err) {
                let feedback = {
                    message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
                    data: [],
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                (0, misc_1.response)(res, feedback);
                return;
            }
        };
        // 
        this.updateProfileData = (req, res, next) => {
            try {
                ProfileSchema.userDataUpdateSchema.validateAsync(req.body)
                    .then((data) => {
                    profile_1.default.updateProfile(req.user_id, data)
                        .then((data) => {
                        (0, misc_1.response)(res, data);
                        return;
                    })
                        .catch((err) => {
                        (0, misc_1.response)(res, err);
                        return;
                    });
                })
                    .catch((err) => {
                    console.log({ err, d: err.details[0] });
                    err.details[0].message = err.details[0].message.replace(/"/g, "");
                    if (err.details[0].message.includes("fails to match the required pattern")) {
                        err.details[0].message = `Invalid ${err.details[0].context.key}`;
                    }
                    let feedback = {
                        message: err.details[0].message,
                        data: err.details,
                        status: 400,
                        statusCode: "FORM_REQUIREMENT_ERROR"
                    };
                    (0, misc_1.response)(res, feedback);
                    return;
                });
            }
            catch (err) {
                let feedback = {
                    message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
                    data: [],
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                (0, misc_1.response)(res, feedback);
                return;
            }
        };
        //updatePassword
        this.updatePassword = (req, res, next) => {
            try {
                ProfileSchema.PasswordUpdateDataSchema.validateAsync(req.body)
                    .then((data) => {
                    profile_1.default.updatePassword(req.user_id, data)
                        .then((data) => {
                        (0, misc_1.response)(res, data);
                        return;
                    })
                        .catch((err) => {
                        (0, misc_1.response)(res, err);
                        return;
                    });
                })
                    .catch((err) => {
                    console.log({ err, d: err.details[0] });
                    err.details[0].message = err.details[0].message.replace(/"/g, "");
                    if (err.details[0].message.includes("fails to match the required pattern")) {
                        err.details[0].message = `Invalid ${err.details[0].context.key}`;
                    }
                    let feedback = {
                        message: err.details[0].message,
                        data: err.details,
                        status: 400,
                        statusCode: "FORM_REQUIREMENT_ERROR"
                    };
                    (0, misc_1.response)(res, feedback);
                    return;
                });
            }
            catch (err) {
                let feedback = {
                    message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
                    data: [],
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                (0, misc_1.response)(res, feedback);
                return;
            }
        };
        // deleteAccount
        this.deleteAccount = (req, res, next) => {
            try {
                profile_1.default.DeleteAccount(req.user_id, req.user_token)
                    .then((data) => {
                    (0, misc_1.response)(res, data);
                    return;
                })
                    .catch((err) => {
                    (0, misc_1.response)(res, err);
                    return;
                });
            }
            catch (err) {
                let feedback = {
                    message: "We're sorry, an unknown error occurred while processing your request. Please try again later or contact our support team if the issue persists",
                    data: [],
                    status: 500,
                    statusCode: "UNKNOWN_ERROR"
                };
                (0, misc_1.response)(res, feedback);
                return;
            }
        };
        console.log("Auth Login Controller Started. ");
    }
}
exports.default = new ProfileMiddleware();
