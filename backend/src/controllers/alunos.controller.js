const alunosService = require('../services/alunos.service');

const listarAlunos = async (req, res) => {
  try {
    const filters = {
      curso: req.query.curso,
      situacao: req.query.situacao
    };
    const alunos = await alunosService.listarAlunos(filters);
    res.json(alunos);
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({ error: error.message });
  }
};

const buscarAlunoPorCpf = async (req, res) => {
  try {
    const aluno = await alunosService.buscarPorCpf(req.params.cpf);
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json(aluno);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ error: error.message });
  }
};

const atualizarAluno = async (req, res) => {
  try {
    const aluno = await alunosService.atualizarAluno(req.params.cpf, req.body);
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json(aluno);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarAlunos,
  buscarAlunoPorCpf,
  atualizarAluno
};
