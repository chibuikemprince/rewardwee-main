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
Object.defineProperty(exports, "__esModule", { value: true });
const RegisterController = __importStar(require("../controllers/register"));
const RegSchema = __importStar(require("../middlewares/schemas/register"));
const misc_1 = require("../helpers/misc");
class RegistrationMiddleware {
    constructor() {
        this.register = (req, res, next) => {
            try {
                RegSchema.registerSchema.validateAsync(req.body)
                    .then((data) => {
                    RegisterController.formReg(data)
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
        this.activateAccount = (req, res, next) => {
            try {
                RegSchema.ActivateAccount.validateAsync(req.body)
                    .then((data) => {
                    RegisterController.activateAccount(data)
                        .then((data) => {
                        console.log({ data });
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
        this.resendActivation = (req, res, next) => {
            try {
                RegSchema.resendActivationCode.validateAsync(req.body)
                    .then((data) => {
                    console.log({ data });
                    RegisterController.resendActivationCode(data.email)
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
        console.log("RegistrationMiddleware constructor called");
    }
}
exports.default = new RegistrationMiddleware();
