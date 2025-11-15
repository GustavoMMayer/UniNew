const Joi = require('joi');

const createFornecedorSchema = Joi.object({
  cnpj: Joi.string().length(14).pattern(/^\d+$/).required().messages({
    'string.length': 'CNPJ deve ter 14 dígitos',
    'string.pattern.base': 'CNPJ deve conter apenas números',
    'any.required': 'CNPJ é obrigatório'
  }),
  razao_social: Joi.string().required().messages({
    'string.empty': 'Razão social é obrigatória',
    'any.required': 'Razão social é obrigatória'
  }),
  contatos: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'Pelo menos um contato deve ser fornecido',
    'any.required': 'Contatos são obrigatórios'
  }),
  servicos: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'Pelo menos um serviço deve ser fornecido',
    'any.required': 'Serviços são obrigatórios'
  })
});

const updateFornecedorSchema = Joi.object({
  razao_social: Joi.string(),
  contatos: Joi.array().items(Joi.string()).min(1).messages({
    'array.min': 'Pelo menos um contato deve ser fornecido'
  }),
  servicos: Joi.array().items(Joi.string()).min(1).messages({
    'array.min': 'Pelo menos um serviço deve ser fornecido'
  })
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});

module.exports = {
  createFornecedorSchema,
  updateFornecedorSchema
};
