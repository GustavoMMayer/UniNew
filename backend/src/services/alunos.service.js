const alunosRepository = require('../repositories/alunos.repository');

class AlunosService {
  async listarAlunos(filters = {}) {
    return await alunosRepository.findAll(filters);
  }

  async buscarPorCpf(cpf) {
    return await alunosRepository.findByCpf(cpf);
  }

  async atualizarAluno(cpf, dadosAtualizacao) {
    return await alunosRepository.update(cpf, dadosAtualizacao);
  }
}

module.exports = new AlunosService();
