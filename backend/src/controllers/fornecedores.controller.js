const fornecedoresService = require('../services/fornecedores.service');

const listarFornecedores = async (req, res) => {
  try {
    const fornecedores = await fornecedoresService.listarFornecedores();
    res.json(fornecedores);
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    res.status(500).json({ error: error.message });
  }
};

const buscarFornecedorPorCnpj = async (req, res) => {
  try {
    const fornecedor = await fornecedoresService.buscarPorCnpj(req.params.cnpj);
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json(fornecedor);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({ error: error.message });
  }
};

const criarFornecedor = async (req, res) => {
  try {
    const fornecedor = await fornecedoresService.criarFornecedor(req.body);
    res.status(201).json(fornecedor);
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({ error: error.message });
  }
};

const atualizarFornecedor = async (req, res) => {
  try {
    const fornecedor = await fornecedoresService.atualizarFornecedor(req.params.cnpj, req.body);
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json(fornecedor);
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ error: error.message });
  }
};

const deletarFornecedor = async (req, res) => {
  try {
    const resultado = await fornecedoresService.excluirFornecedor(req.params.cnpj);
    if (!resultado) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json({ message: 'Fornecedor excluído com sucesso', fornecedor: resultado });
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarFornecedores,
  buscarFornecedorPorCnpj,
  criarFornecedor,
  atualizarFornecedor,
  deletarFornecedor
};
