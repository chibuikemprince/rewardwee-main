"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginRecordParams = exports.resetPassword = exports.requestResetPasswordOtp = exports.loginRequest = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginRequest = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
exports.requestResetPasswordOtp = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.resetPassword = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().required(),
    newpassword: joi_1.default.string().min(6).max(50).required(),
});
exports.getLoginRecordParams = joi_1.default.object({
    next: joi_1.default.number().required(),
    durationStart: joi_1.default.number().required(),
    durationStop: joi_1.default.number().required()
});
