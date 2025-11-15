const docentesRepository = require('../repositories/docentes.repository');

class DocentesService {
  async listarDocentes() {
    return await docentesRepository.findAll();
  }

  async buscarPorCpf(cpf) {
    return await docentesRepository.findByCpf(cpf);
  }

  async atualizarDocente(cpf, dadosAtualizacao) {
    return await docentesRepository.update(cpf, dadosAtualizacao);
  }
}

module.exports = new DocentesService();
