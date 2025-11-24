const express = require('express');
const router = express.Router();
const grausAcademicosController = require('../controllers/graus-academicos.controller');

// GET /api/graus-academicos - Lista graus acadêmicos
router.get('/', grausAcademicosController.listarGraus);

module.exports = router;
