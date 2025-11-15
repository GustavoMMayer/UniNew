const express = require('express');
const router = express.Router();
const notasController = require('../controllers/notas.controller');
const { validateBody, validateQuery } = require('../middlewares/validation.middleware');
const { createNotaSchema, updateNotaSchema, queryNotaSchema } = require('../validators/nota.validator');

// GET /api/notas - Lista notas (com filtro opcional por disciplina_codigo)
router.get('/', validateQuery(queryNotaSchema), notasController.listarNotas);

// GET /api/notas/aluno/:cpf - Lista notas de um aluno específico
router.get('/aluno/:cpf', notasController.listarNotasPorAluno);

// GET /api/notas/:id - Busca nota específica por ID
router.get('/:id', notasController.buscarNotaPorId);

// POST /api/notas - Cria nota
router.post('/', validateBody(createNotaSchema), notasController.criarNota);

module.exports = router;
