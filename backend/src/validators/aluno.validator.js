const Joi = require('joi');

const updateAlunoSchema = Joi.object({
  nome: Joi.string(),
  email: Joi.string().email(),
  telefone: Joi.string().allow('', null),
  curso: Joi.string().allow('', null),
  situacao: Joi.string().allow('', null)
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});

const queryAlunoSchema = Joi.object({
  curso: Joi.string(),
  situacao: Joi.string()
}).unknown(false);

module.exports = {
  updateAlunoSchema,
  queryAlunoSchema
};
