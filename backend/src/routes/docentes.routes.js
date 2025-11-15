const express = require('express');
const router = express.Router();
const docentesController = require('../controllers/docentes.controller');
const { validateBody } = require('../middlewares/validation.middleware');
const { updateDocenteSchema } = require('../validators/docente.validator');

// GET /api/docentes - Lista docentes
router.get('/', docentesController.listarDocentes);

// GET /api/docentes/:cpf - Busca docente por CPF
router.get('/:cpf', docentesController.buscarDocentePorCpf);

// PUT /api/docentes/:cpf - Atualiza docente
router.put('/:cpf', validateBody(updateDocenteSchema), docentesController.atualizarDocente);

module.exports = router;
