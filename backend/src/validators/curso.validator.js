const Joi = require('joi');

const createCursoSchema = Joi.object({
  nome: Joi.string().required().messages({
    'string.empty': 'Nome do curso é obrigatório',
    'any.required': 'Nome do curso é obrigatório'
  }),
  disciplinas: Joi.array().items(Joi.number().integer()).default([])
});

const updateCursoSchema = Joi.object({
  nome: Joi.string(),
  disciplinas: Joi.array().items(Joi.number().integer())
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});

module.exports = {
  createCursoSchema,
  updateCursoSchema
};
