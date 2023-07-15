import joi from "joi";

export const loginRequest = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});


export const requestResetPasswordOtp = joi.object({
    email: joi.string().email().required()
});


export const resetPassword = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
    newpassword: joi.string().min(6).max(50).required(),

});



export const getLoginRecordParams = joi.object({
    next: joi.number().required(), 
    durationStart: joi.number().required(), 
    durationStop: joi.number().required() 

});





