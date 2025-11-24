const fornecedoresRepository = require('../repositories/fornecedores.repository');

class FornecedoresService {
  async listarFornecedores() {
    return await fornecedoresRepository.findAll();
  }

  async buscarPorCnpj(cnpj) {
    return await fornecedoresRepository.findByCnpj(cnpj);
  }

  async criarFornecedor(dadosFornecedor) {
    return await fornecedoresRepository.create(dadosFornecedor);
  }

  async atualizarFornecedor(cnpj, dadosAtualizacao) {
    return await fornecedoresRepository.update(cnpj, dadosAtualizacao);
  }

  async excluirFornecedor(cnpj) {
    const fornecedor = await fornecedoresRepository.findByCnpj(cnpj);
    if (!fornecedor) return null;
    
    await fornecedoresRepository.delete(cnpj);
    
    return {
      cnpj: fornecedor.cnpj,
      razao_social: fornecedor.razao_social
    };
  }
}

module.exports = new FornecedoresService();
