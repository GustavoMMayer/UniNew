const usuariosRepository = require('../repositories/usuarios.repository');

class UsuariosService {
  async listarUsuarios(filters = {}) {
    return await usuariosRepository.findAll(filters);
  }

  async buscarPorCpf(cpf) {
    return await usuariosRepository.findByCpf(cpf);
  }

  async buscarPorEmail(email) {
    return await usuariosRepository.findByEmail(email);
  }

  async criarUsuario(dadosUsuario) {
    
    const tipoContaIdMap = {
      'aluno': 1,
      'docente': 2,
      'funcionario': 3,
      'gerente': 4
    };
    
    const dadosCompletos = {
      ...dadosUsuario,
      tipo_conta_id: tipoContaIdMap[dadosUsuario.tipo_conta]
    };
    
    return await usuariosRepository.create(dadosCompletos);
  }

  async atualizarUsuario(cpf, dadosAtualizacao) {
    
    return await usuariosRepository.update(cpf, dadosAtualizacao);
  }

  async excluirUsuario(cpf) {
    
    const usuario = await usuariosRepository.findByCpf(cpf);
    if (!usuario) return null;
    
    await usuariosRepository.delete(cpf);
    
    return {
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email
    };
  }
}

module.exports = new UsuariosService();
