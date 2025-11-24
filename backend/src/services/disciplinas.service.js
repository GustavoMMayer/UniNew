const disciplinasRepository = require('../repositories/disciplinas.repository');

class DisciplinasService {
  async listarDisciplinas() {
    return await disciplinasRepository.findAll();
  }

  async buscarPorId(id) {
    return await disciplinasRepository.findById(id);
  }

  async criarDisciplina(dadosDisciplina) {
    const dadosCompletos = {
      nome: dadosDisciplina.nome,
      carga_horaria: dadosDisciplina.carga_horaria
    };
    
    return await disciplinasRepository.create(dadosCompletos);
  }

  async atualizarDisciplina(id, dadosAtualizacao) {
    return await disciplinasRepository.update(id, dadosAtualizacao);
  }

  async excluirDisciplina(id) {
    const disciplina = await disciplinasRepository.findById(id);
    if (!disciplina) return null;
    
    await disciplinasRepository.delete(id);
    
    return {
      id: disciplina.id,
      nome: disciplina.nome
    };
  }
}

module.exports = new DisciplinasService();
