const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username é obrigatório',
    'any.required': 'Username é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória'
  })
});

module.exports = {
  loginSchema
};
