import joi from "joi";

/* import JoiPhoneNumber  from "joi-phone-number";

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
 */


 
export const CreateSubscriptionPlan = joi.object({
   
    name: joi.string().required(),
    description: joi.array() ,
    price: joi.number().required(),
    duration: joi.number().required(),
    currency: joi.string().required(), 
    adminId: joi.string(),
    freeTrialDuration: joi.number()
 

});


 
export const UpdateSubscriptionPlan = joi.object({
   
    name: joi.string(),
    description: joi.array() ,
   
    price: joi.number() ,
    duration: joi.number() ,
    currency: joi.string() ,
    freeTrialDuration: joi.number()
 

});


 
export const GetSIngleSubscriptionPlan = joi.object({
   
    plan_id: joi.string().required(),
    
 

});




