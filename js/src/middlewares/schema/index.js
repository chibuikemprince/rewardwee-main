"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = void 0;
// Joi.any().valid('template1', 'template2').required(),
const templateId_1 = require("../../helpers/templateId");
const joi_1 = __importDefault(require("joi"));
exports.emailSchema = joi_1.default.object({
    receiver: joi_1.default.string().email().required(),
    message: joi_1.default.string().required(),
    template: joi_1.default.string().valid(Object.keys(templateId_1.EMAIL_TEMPLATES).join(",")).required(),
    subject: joi_1.default.string().required(),
});
