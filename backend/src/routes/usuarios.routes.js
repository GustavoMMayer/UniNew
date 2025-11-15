const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { validateBody, validateQuery } = require('../middlewares/validation.middleware');
const { createUsuarioSchema, updateUsuarioSchema } = require('../validators/usuario.validator');
const Joi = require('joi');

// Schema para query params de usuários
const queryUsuarioSchema = Joi.object({
  tipo_conta: Joi.string().valid('aluno', 'docente', 'funcionario', 'gerente'),
  curso: Joi.string(),
  situacao: Joi.string().valid('Ativo', 'Inativo')
}).unknown(false);

// GET /api/usuarios - Lista usuários (com filtros opcionais)
router.get('/', validateQuery(queryUsuarioSchema), usuariosController.listarUsuarios);

// GET /api/usuarios/email/:email - Busca por email
router.get('/email/:email', usuariosController.buscarPorEmail);

// GET /api/usuarios/:cpf - Busca por CPF
router.get('/:cpf', usuariosController.buscarPorCpf);

// POST /api/usuarios - Cria usuário
router.post('/', validateBody(createUsuarioSchema), usuariosController.criarUsuario);

// PUT /api/usuarios/:cpf - Atualiza usuário
router.put('/:cpf', validateBody(updateUsuarioSchema), usuariosController.atualizarUsuario);

// DELETE /api/usuarios/:cpf - Deleta usuário
router.delete('/:cpf', usuariosController.deletarUsuario);

module.exports = router;
