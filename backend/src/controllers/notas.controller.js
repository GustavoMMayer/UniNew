const notasService = require('../services/notas.service');

const listarNotas = async (req, res) => {
  try {
    const notas = await notasService.listarNotas(req.query);
    res.json(notas);
  } catch (error) {
    console.error('Erro ao listar notas:', error);
    res.status(500).json({ error: error.message });
  }
};

const listarNotasPorAluno = async (req, res) => {
  try {
    const notas = await notasService.buscarPorAluno(req.params.cpf);
    res.json(notas);
  } catch (error) {
    console.error('Erro ao listar notas do aluno:', error);
    res.status(500).json({ error: error.message });
  }
};

const buscarNotaPorId = async (req, res) => {
  try {
    const nota = await notasService.buscarPorId(req.params.id);
    if (!nota) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.json(nota);
  } catch (error) {
    console.error('Erro ao buscar nota:', error);
    res.status(500).json({ error: error.message });
  }
};

const criarNota = async (req, res) => {
  try {
    const nota = await notasService.criarNota(req.body);
    res.status(201).json(nota);
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarNotas,
  listarNotasPorAluno,
  buscarNotaPorId,
  criarNota
};
