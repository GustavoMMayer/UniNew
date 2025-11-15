const Joi = require('joi');

const createCursoSchema = Joi.object({
  codigo: Joi.string().uppercase().pattern(/^[A-Z_]+$/).allow('').messages({
    'string.pattern.base': 'Código deve conter apenas letras maiúsculas e underscore'
  }),
  nome: Joi.string().required().messages({
    'string.empty': 'Nome do curso é obrigatório',
    'any.required': 'Nome do curso é obrigatório'
  }),
  disciplinas: Joi.array().items(Joi.string()).default([])
});

const updateCursoSchema = Joi.object({
  nome: Joi.string(),
  disciplinas: Joi.array().items(Joi.string())
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});

module.exports = {
  createCursoSchema,
  updateCursoSchema
};
