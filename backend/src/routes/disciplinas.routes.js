const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/disciplinas.controller');
const { validateBody } = require('../middlewares/validation.middleware');
const { createDisciplinaSchema, updateDisciplinaSchema } = require('../validators/disciplina.validator');

// GET /api/disciplinas - Lista disciplinas
router.get('/', disciplinasController.listarDisciplinas);

// GET /api/disciplinas/:codigo - Busca disciplina por código
router.get('/:codigo', disciplinasController.buscarDisciplinaPorCodigo);

// POST /api/disciplinas - Cria disciplina
router.post('/', validateBody(createDisciplinaSchema), disciplinasController.criarDisciplina);

// PUT /api/disciplinas/:codigo - Atualiza disciplina
router.put('/:codigo', validateBody(updateDisciplinaSchema), disciplinasController.atualizarDisciplina);

module.exports = router;
