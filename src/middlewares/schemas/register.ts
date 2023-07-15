import joi from "joi";
import JoiPhoneNumber  from "joi-phone-number";

let phoneJoi = joi.extend(JoiPhoneNumber);

export const registerSchema = phoneJoi.object({
    firstName: phoneJoi.string().required(),
    lastName: phoneJoi.string().required(),
    email: phoneJoi.string().email().required(),
    phoneNumber: phoneJoi.string().phoneNumber().pattern(/^\+[0-9]{4,18}$/).required(),
    password: phoneJoi.string().min(6).max(50).required(),
    company: phoneJoi.string().required(), 
    team: phoneJoi.string().required()
})

export const ActivateAccount = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required()
});


export const resendActivationCode = joi.object({
    email: joi.string().email().required()
});





