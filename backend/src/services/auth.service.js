const bcrypt = require('bcrypt');
const usuariosRepository = require('../repositories/usuarios.repository');

class AuthService {
  async login(username, password) {
    const usuario = await usuariosRepository.findForAuth(username);
    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }
    
    const senhaValida = await bcrypt.compare(password, usuario.senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }
    
    const { senha, ...usuarioSemSenha } = usuario;
    
    return {
      usuario: usuarioSemSenha
    };
  }

  async logout(token) {
    return { ok: true };
  }
}

module.exports = new AuthService();
