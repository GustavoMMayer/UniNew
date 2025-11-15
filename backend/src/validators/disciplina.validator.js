const Joi = require('joi');

const createDisciplinaSchema = Joi.object({
  codigo: Joi.string().length(3).uppercase().pattern(/^[A-Z_]+$/).allow('').messages({
    'string.length': 'Código deve ter exatamente 3 caracteres',
    'string.pattern.base': 'Código deve conter apenas letras maiúsculas e underscore'
  }),
  nome: Joi.string().required().messages({
    'string.empty': 'Nome da disciplina é obrigatório',
    'any.required': 'Nome da disciplina é obrigatório'
  }),
  carga_horaria: Joi.number().integer().min(1).max(500).required().messages({
    'number.min': 'Carga horária deve ser maior que 0',
    'number.max': 'Carga horária não pode exceder 500 horas',
    'any.required': 'Carga horária é obrigatória'
  })
});

const updateDisciplinaSchema = Joi.object({
  nome: Joi.string(),
  carga_horaria: Joi.number().integer().min(1).max(500).messages({
    'number.min': 'Carga horária deve ser maior que 0',
    'number.max': 'Carga horária não pode exceder 500 horas'
  })
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});

module.exports = {
  createDisciplinaSchema,
  updateDisciplinaSchema
};
