const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/disciplinas.controller');
const { validateBody } = require('../middlewares/validation.middleware');
const { createDisciplinaSchema, updateDisciplinaSchema } = require('../validators/disciplina.validator');

// GET /api/disciplinas - Lista disciplinas
router.get('/', disciplinasController.listarDisciplinas);

// GET /api/disciplinas/:id - Busca disciplina por id
router.get('/:id', disciplinasController.buscarDisciplinaPorId);

// POST /api/disciplinas - Cria disciplina
router.post('/', validateBody(createDisciplinaSchema), disciplinasController.criarDisciplina);

// PUT /api/disciplinas/:id - Atualiza disciplina
router.put('/:id', validateBody(updateDisciplinaSchema), disciplinasController.atualizarDisciplina);

module.exports = router;
