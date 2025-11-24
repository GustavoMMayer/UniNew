const cursosRepository = require('../repositories/cursos.repository');

class CursosService {
  async listarCursos() {
    return await cursosRepository.findAll();
  }

  async buscarPorId(id) {
    return await cursosRepository.findById(id);
  }

  async criarCurso(dadosCurso) {
    const dadosCompletos = {
      nome: dadosCurso.nome,
      disciplinas: dadosCurso.disciplinas || []
    };
    
    return await cursosRepository.create(dadosCompletos);
  }

  async atualizarCurso(id, dadosAtualizacao) {
    return await cursosRepository.update(id, dadosAtualizacao);
  }

  async excluirCurso(id) {
    const curso = await cursosRepository.findById(id);
    if (!curso) return null;
    
    await cursosRepository.delete(id);
    
    return {
      id: curso.id,
      nome: curso.nome
    };
  }
}

module.exports = new CursosService();
