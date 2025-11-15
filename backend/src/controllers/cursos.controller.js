const cursosService = require('../services/cursos.service');

const listarCursos = async (req, res) => {
  try {
    const cursos = await cursosService.listarCursos();
    res.json(cursos);
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({ error: error.message });
  }
};

const buscarCursoPorCodigo = async (req, res) => {
  try {
    const curso = await cursosService.buscarPorCodigo(req.params.codigo);
    if (!curso) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const criarCurso = async (req, res) => {
  try {
    const curso = await cursosService.criarCurso(req.body);
    res.status(201).json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarCurso = async (req, res) => {
  try {
    const curso = await cursosService.atualizarCurso(req.params.codigo, req.body);
    if (!curso) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarCursos,
  buscarCursoPorCodigo,
  criarCurso,
  atualizarCurso
};
