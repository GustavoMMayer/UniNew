const Joi = require('joi');

const createDocenteSchema = Joi.object({
  cpf: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    'string.length': 'CPF deve ter 11 dígitos',
    'string.pattern.base': 'CPF deve conter apenas números',
    'any.required': 'CPF é obrigatório'
  }),
  nome: Joi.string().required().messages({
    'string.empty': 'Nome é obrigatório',
    'any.required': 'Nome é obrigatório'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório'
  }),
  telefone: Joi.string().allow('', null),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória'
  }),
  tipo_conta: Joi.string().valid('docente').optional().default('docente'),
  grau_academico: Joi.string().allow('', null),
  disciplina: Joi.string().allow('', null),
  carga_horaria: Joi.number().integer().min(0).max(168).allow(null)
});

const updateDocenteSchema = Joi.object({
  nome: Joi.string(),
  email: Joi.string().email(),
  telefone: Joi.string(),
  grau_academico: Joi.string(),
  disciplina: Joi.string(),
  carga_horaria: Joi.number().integer().min(0).max(168)
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização',
  'number.max': 'Carga horária não pode exceder 168 horas semanais',
  'string.email': 'Email deve ser válido'
});

module.exports = {
  createDocenteSchema,
  updateDocenteSchema
};

