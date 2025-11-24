const Joi = require('joi');

const createNotaSchema = Joi.object({
  id: Joi.string().allow(''),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    'string.length': 'CPF deve ter 11 dígitos',
    'string.pattern.base': 'CPF deve conter apenas números',
    'any.required': 'CPF do aluno é obrigatório'
  }),
  disciplina: Joi.string().required().messages({
    'string.empty': 'Nome da disciplina é obrigatório',
    'any.required': 'Nome da disciplina é obrigatório'
  }),
  disciplina_id: Joi.number().integer().required().messages({
    'any.required': 'ID da disciplina é obrigatório'
  }),
  nota: Joi.number().min(0).max(10).precision(2).required().messages({
    'number.min': 'Nota deve ser entre 0 e 10',
    'number.max': 'Nota deve ser entre 0 e 10',
    'any.required': 'Nota é obrigatória'
  }),
  descricao: Joi.string().allow('', null),
  observacao: Joi.string().allow('', null)
});

const updateNotaSchema = Joi.object({
  nota: Joi.number().min(0).max(10).precision(2).messages({
    'number.min': 'Nota deve ser entre 0 e 10',
    'number.max': 'Nota deve ser entre 0 e 10'
  }),
  descricao: Joi.string().allow('', null),
  observacao: Joi.string().allow('', null)
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});

const queryNotaSchema = Joi.object({
  disciplina_id: Joi.number().integer()
}).unknown(false);

module.exports = {
  createNotaSchema,
  updateNotaSchema,
  queryNotaSchema
};
