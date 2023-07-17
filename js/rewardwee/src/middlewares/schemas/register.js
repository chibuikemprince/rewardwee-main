"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendActivationCode = exports.ActivateAccount = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_phone_number_1 = __importDefault(require("joi-phone-number"));
let phoneJoi = joi_1.default.extend(joi_phone_number_1.default);
exports.registerSchema = phoneJoi.object({
    firstName: phoneJoi.string().required(),
    lastName: phoneJoi.string().required(),
    email: phoneJoi.string().email().required(),
    phoneNumber: phoneJoi.string().phoneNumber().pattern(/^\+[0-9]{4,18}$/).required(),
    password: phoneJoi.string().min(6).max(50).required(),
    company: phoneJoi.string().required(),
    team: phoneJoi.string().required()
});
exports.ActivateAccount = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().required()
});
exports.resendActivationCode = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
