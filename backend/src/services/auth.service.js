const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepository = require('../repositories/usuarios.repository');
const jwtConfig = require('../config/jwt');

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
    
    const token = jwt.sign(
      { 
        cpf: usuario.cpf, 
        tipo_conta: usuario.tipo_conta,
        email: usuario.email
      }, 
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    const { senha, ...usuarioSemSenha } = usuario;
    
    return {
      token,
      usuario: usuarioSemSenha
    };
  }

  async logout(token) {
    return { ok: true };
  }
}

module.exports = new AuthService();
