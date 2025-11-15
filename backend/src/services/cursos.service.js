const cursosRepository = require('../repositories/cursos.repository');

class CursosService {
  async listarCursos() {
    return await cursosRepository.findAll();
  }

  async buscarPorCodigo(codigo) {
    return await cursosRepository.findByCodigo(codigo);
  }

  async criarCurso(dadosCurso) {
    const codigo = dadosCurso.codigo || this._gerarCodigo(dadosCurso.nome);
    
    const dadosCompletos = {
      codigo: codigo,
      nome: dadosCurso.nome,
      disciplinas: dadosCurso.disciplinas || []
    };
    
    return await cursosRepository.create(dadosCompletos);
  }

  async atualizarCurso(codigo, dadosAtualizacao) {
    return await cursosRepository.update(codigo, dadosAtualizacao);
  }

  async excluirCurso(codigo) {
    const curso = await cursosRepository.findByCodigo(codigo);
    if (!curso) return null;
    
    await cursosRepository.delete(codigo);
    
    return {
      codigo: curso.codigo,
      nome: curso.nome
    };
  }

  _gerarCodigo(nome) {
    return nome.substring(0, 3).toUpperCase();
  }
}

module.exports = new CursosService();
