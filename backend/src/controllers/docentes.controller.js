const docentesService = require('../services/docentes.service');

const listarDocentes = async (req, res) => {
  try {
    const docentes = await docentesService.listarDocentes();
    res.json(docentes);
  } catch (error) {
    console.error('Erro ao listar docentes:', error);
    res.status(500).json({ error: error.message });
  }
};

const buscarDocentePorCpf = async (req, res) => {
  try {
    const docente = await docentesService.buscarPorCpf(req.params.cpf);
    if (!docente) {
      return res.status(404).json({ error: 'Docente não encontrado' });
    }
    res.json(docente);
  } catch (error) {
    console.error('Erro ao buscar docente:', error);
    res.status(500).json({ error: error.message });
  }
};

const atualizarDocente = async (req, res) => {
  try {
    const docente = await docentesService.atualizarDocente(req.params.cpf, req.body);
    if (!docente) {
      return res.status(404).json({ error: 'Docente não encontrado' });
    }
    res.json(docente);
  } catch (error) {
    console.error('Erro ao atualizar docente:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarDocentes,
  buscarDocentePorCpf,
  atualizarDocente
};
