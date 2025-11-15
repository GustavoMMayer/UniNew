const disciplinasRepository = require('../repositories/disciplinas.repository');

class DisciplinasService {
  async listarDisciplinas() {
    return await disciplinasRepository.findAll();
  }

  async buscarPorCodigo(codigo) {
    return await disciplinasRepository.findByCodigo(codigo);
  }

  async criarDisciplina(dadosDisciplina) {
    const codigo = dadosDisciplina.codigo || this._gerarCodigo(dadosDisciplina.nome);
    
    const dadosCompletos = {
      codigo: codigo,
      nome: dadosDisciplina.nome,
      carga_horaria: dadosDisciplina.carga_horaria
    };
    
    return await disciplinasRepository.create(dadosCompletos);
  }

  async atualizarDisciplina(codigo, dadosAtualizacao) {
    return await disciplinasRepository.update(codigo, dadosAtualizacao);
  }

  async excluirDisciplina(codigo) {
    const disciplina = await disciplinasRepository.findByCodigo(codigo);
    if (!disciplina) return null;
    
    await disciplinasRepository.delete(codigo);
    
    return {
      codigo: disciplina.codigo,
      nome: disciplina.nome
    };
  }

  _gerarCodigo(nome) {
    return nome.substring(0, 3).toUpperCase();
  }
}

module.exports = new DisciplinasService();
