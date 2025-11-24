const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        cpf: usuario.cpf,
        tipo_conta: usuario.tipo_conta,
        email: usuario.email
      },
      process.env.JWT_SECRET || 'secret-key-dev',
      { expiresIn: '24h' }
    );
    
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

