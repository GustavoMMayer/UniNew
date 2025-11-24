const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos.controller');
const { validateBody } = require('../middlewares/validation.middleware');
const { createCursoSchema, updateCursoSchema } = require('../validators/curso.validator');

// GET /api/cursos - Lista cursos
router.get('/', cursosController.listarCursos);

// GET /api/cursos/:id - Busca curso por ID
router.get('/:id', cursosController.buscarCursoPorId);

// POST /api/cursos - Cria curso
router.post('/', validateBody(createCursoSchema), cursosController.criarCurso);

// PUT /api/cursos/:id - Atualiza curso
router.put('/:id', validateBody(updateCursoSchema), cursosController.atualizarCurso);

module.exports = router;
