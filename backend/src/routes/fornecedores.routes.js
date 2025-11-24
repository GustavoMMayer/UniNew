const express = require('express');
const router = express.Router();
const fornecedoresController = require('../controllers/fornecedores.controller');
const { validateBody } = require('../middlewares/validation.middleware');
const { createFornecedorSchema, updateFornecedorSchema } = require('../validators/fornecedor.validator');

// GET /api/fornecedores - Lista fornecedores
router.get('/', fornecedoresController.listarFornecedores);

// GET /api/fornecedores/:cnpj - Busca fornecedor por CNPJ
router.get('/:cnpj', fornecedoresController.buscarFornecedorPorCnpj);

// POST /api/fornecedores - Cria fornecedor
router.post('/', validateBody(createFornecedorSchema), fornecedoresController.criarFornecedor);

// PUT /api/fornecedores/:cnpj - Atualiza fornecedor
router.put('/:cnpj', validateBody(updateFornecedorSchema), fornecedoresController.atualizarFornecedor);

// DELETE /api/fornecedores/:cnpj - Deleta fornecedor
router.delete('/:cnpj', fornecedoresController.deletarFornecedor);

module.exports = router;
