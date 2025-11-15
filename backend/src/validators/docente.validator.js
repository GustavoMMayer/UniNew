const Joi = require('joi');

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
  updateDocenteSchema
};
