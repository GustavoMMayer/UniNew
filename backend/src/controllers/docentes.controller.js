const docentesService = require('../services/docentes.service');
const usuariosService = require('../services/usuarios.service');

const criarDocente = async (req, res) => {
  try {
    // Garantir que tipo_conta seja 'docente'
    const dadosDocente = { ...req.body, tipo_conta: 'docente' };
    const docente = await usuariosService.criarUsuario(dadosDocente);
    res.status(201).json(docente);
  } catch (error) {
    console.error('Erro ao criar docente:', error);
    res.status(500).json({ error: error.message });
  }
};

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
  criarDocente,
  listarDocentes,
  buscarDocentePorCpf,
  atualizarDocente
};
