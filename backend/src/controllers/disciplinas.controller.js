const disciplinasService = require('../services/disciplinas.service');

const listarDisciplinas = async (req, res) => {
  try {
    const disciplinas = await disciplinasService.listarDisciplinas();
    res.json(disciplinas);
  } catch (error) {
    console.error('Erro ao listar disciplinas:', error);
    res.status(500).json({ error: error.message });
  }
};

const buscarDisciplinaPorCodigo = async (req, res) => {
  try {
    const disciplina = await disciplinasService.buscarPorCodigo(req.params.codigo);
    if (!disciplina) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    res.json(disciplina);
  } catch (error) {
    console.error('Erro ao buscar disciplina:', error);
    res.status(500).json({ error: error.message });
  }
};

const criarDisciplina = async (req, res) => {
  try {
    const disciplina = await disciplinasService.criarDisciplina(req.body);
    res.status(201).json(disciplina);
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
    res.status(500).json({ error: error.message });
  }
};

const atualizarDisciplina = async (req, res) => {
  try {
    const disciplina = await disciplinasService.atualizarDisciplina(req.params.codigo, req.body);
    if (!disciplina) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    res.json(disciplina);
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarDisciplinas,
  buscarDisciplinaPorCodigo,
  criarDisciplina,
  atualizarDisciplina
};
