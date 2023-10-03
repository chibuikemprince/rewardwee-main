import joi from "joi";


export const searchUsersProfileSchema = joi.object({

    email: 		joi.string().email(),
    firstName: joi.string(),
    lastName:  joi.string(),
    company: joi.string(),
    team: 		joi.string()


})


export const searchUsersProfileByAdminSchema = joi.object({
    email: joi.string().email(),
    phoneNumber: joi.string(),
    id: joi.string(),
    firstName: joi.string(),
    lastName: joi.string(),
    company: joi.string(),
    team: joi.string(),
    status: joi.string(),
    regDate_from: joi.number(),
    regDate_to:  joi.number(), 
    deleted: joi.boolean()

})

 

export const userDataUpdateSchema = joi.object({
     
    phoneNumber: joi.string(),
    
    firstName: joi.string(),
    lastName: joi.string(),
    company: joi.string(),
    team: joi.string()

})



export const PasswordUpdateDataSchema = joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().min(6).max(50).required(),
    confirmPassword: joi.string().min(6).max(50).required()

    
  })

  



