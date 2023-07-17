"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUpdateDataSchema = exports.userDataUpdateSchema = exports.searchUsersProfileByAdminSchema = exports.searchUsersProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.searchUsersProfileSchema = joi_1.default.object({
    email: joi_1.default.string().email(),
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string(),
    company: joi_1.default.string(),
    team: joi_1.default.string()
});
exports.searchUsersProfileByAdminSchema = joi_1.default.object({
    email: joi_1.default.string().email(),
    phoneNumber: joi_1.default.string(),
    id: joi_1.default.string(),
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string(),
    company: joi_1.default.string(),
    team: joi_1.default.string(),
    status: joi_1.default.string(),
    regDate_from: joi_1.default.number(),
    regDate_to: joi_1.default.number(),
    deleted: joi_1.default.boolean()
});
exports.userDataUpdateSchema = joi_1.default.object({
    phoneNumber: joi_1.default.string(),
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string(),
    company: joi_1.default.string(),
    team: joi_1.default.string()
});
exports.PasswordUpdateDataSchema = joi_1.default.object({
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(6).max(50).required()
});
