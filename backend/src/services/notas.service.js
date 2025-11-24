const notasRepository = require('../repositories/notas.repository');

class NotasService {
  async listarNotas(filters = {}) {
    return await notasRepository.findAll(filters);
  }

  async buscarPorAluno(cpf) {
    return await notasRepository.findByAluno(cpf);
  }

  async buscarPorId(id) {
    return await notasRepository.findById(id);
  }

  async criarNota(dadosNota) {
    const disciplina_id = dadosNota.disciplina_id;
    const id = dadosNota.id || `${dadosNota.cpf}_${disciplina_id}`;
    
    const dadosCompletos = {
      id: id,
      cpf: dadosNota.cpf,
      disciplina: dadosNota.disciplina,
      disciplina_id: disciplina_id,
      nota: dadosNota.nota,
      ...(dadosNota.descricao && { descricao: dadosNota.descricao }),
      ...(dadosNota.observacao && { observacao: dadosNota.observacao })
    };
    
    return await notasRepository.create(dadosCompletos);
  }

  async atualizarNota(id, dadosAtualizacao) {
    return await notasRepository.update(id, dadosAtualizacao);
  }

  async excluirNota(id) {
    const nota = await notasRepository.findById(id);
    if (!nota) return null;
    
    await notasRepository.delete(id);
    
    return {
      id: nota.id,
      cpf: nota.cpf,
      disciplina: nota.disciplina,
      nota: nota.nota
    };
  }
}

module.exports = new NotasService();
