import Joi from "joi";

export const CustomerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^\d{11}$/)
    .required(),
  cpf: Joi.string()
    .pattern(/^\d{11}$/)
    .required(),
  birthday: Joi.date().iso().max("now").required(),
});
