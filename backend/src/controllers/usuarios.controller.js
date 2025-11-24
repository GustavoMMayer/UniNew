const usuariosService = require('../services/usuarios.service');
const bcrypt = require('bcrypt');

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.listarUsuarios(req.query);
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: error.message });
  }
};

const buscarPorCpf = async (req, res) => {
  try {
    const usuario = await usuariosService.buscarPorCpf(req.params.cpf);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: error.message });
  }
};

const buscarPorEmail = async (req, res) => {
  try {
    const usuario = await usuariosService.buscarPorEmail(req.params.email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    res.status(500).json({ error: error.message });
  }
};

const criarUsuario = async (req, res) => {
  try {
    const senhaHash = await bcrypt.hash(req.body.senha, 10);
    const dadosUsuario = {
      ...req.body,
      senha: senhaHash
    };
    
    const usuario = await usuariosService.criarUsuario(dadosUsuario);
    res.status(201).json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: error.message });
  }
};

const atualizarUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.atualizarUsuario(req.params.cpf, req.body);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: error.message });
  }
};

const deletarUsuario = async (req, res) => {
  try {
    const resultado = await usuariosService.excluirUsuario(req.params.cpf);
    if (!resultado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário excluído com sucesso', usuario: resultado });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarUsuarios,
  buscarPorCpf,
  buscarPorEmail,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario
};
