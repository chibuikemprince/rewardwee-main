
// Joi.any().valid('template1', 'template2').required(),
import {EMAIL_TEMPLATES}  from "../../helpers/templateId"
import Joi  from 'joi' ;

export const emailSchema = Joi.object({
  receiver: Joi.string().email().required(),
  message: Joi.string().required(),
  template: Joi.string().valid(Object.keys(EMAIL_TEMPLATES).join(",")  ).required(),
  subject: Joi.string().required(),
});

