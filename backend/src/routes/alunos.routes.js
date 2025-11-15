const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunos.controller');
const { validateBody, validateQuery } = require('../middlewares/validation.middleware');
const { updateAlunoSchema, queryAlunoSchema } = require('../validators/aluno.validator');

// GET /api/alunos - Lista alunos (com filtros opcionais)
router.get('/', validateQuery(queryAlunoSchema), alunosController.listarAlunos);

// GET /api/alunos/:cpf - Busca aluno por CPF
router.get('/:cpf', alunosController.buscarAlunoPorCpf);

// PUT /api/alunos/:cpf - Atualiza aluno
router.put('/:cpf', validateBody(updateAlunoSchema), alunosController.atualizarAluno);

module.exports = router;
