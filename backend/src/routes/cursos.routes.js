const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos.controller');
const { validateBody } = require('../middlewares/validation.middleware');
const { createCursoSchema, updateCursoSchema } = require('../validators/curso.validator');

// GET /api/cursos - Lista cursos
router.get('/', cursosController.listarCursos);

// GET /api/cursos/:codigo - Busca curso por código
router.get('/:codigo', cursosController.buscarCursoPorCodigo);

// POST /api/cursos - Cria curso
router.post('/', validateBody(createCursoSchema), cursosController.criarCurso);

// PUT /api/cursos/:codigo - Atualiza curso
router.put('/:codigo', validateBody(updateCursoSchema), cursosController.atualizarCurso);

module.exports = router;
