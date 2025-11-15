const Joi = require('joi');

const createUsuarioSchema = Joi.object({
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
  tipo_conta: Joi.string().valid('aluno', 'docente', 'funcionario', 'gerente').required().messages({
    'any.only': 'Tipo de conta deve ser: aluno, docente, funcionario ou gerente',
    'any.required': 'Tipo de conta é obrigatório'
  }),
  // Campos opcionais para aluno
  curso: Joi.string().allow('', null),
  situacao: Joi.string().valid('Ativo', 'Inativo').allow('', null),
  // Campos opcionais para docente
  grau_academico: Joi.string().allow('', null),
  disciplina: Joi.string().allow('', null),
  carga_horaria: Joi.number().integer().min(0).allow(null)
});

const updateUsuarioSchema = Joi.object({
  nome: Joi.string(),
  email: Joi.string().email(),
  telefone: Joi.string().allow('', null),
  curso: Joi.string().allow('', null),
  situacao: Joi.string().valid('Ativo', 'Inativo').allow('', null),
  grau_academico: Joi.string().allow('', null),
  disciplina: Joi.string().allow('', null),
  carga_horaria: Joi.number().integer().min(0).allow(null)
}).min(1);

module.exports = {
  createUsuarioSchema,
  updateUsuarioSchema
};
