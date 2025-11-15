module.exports = {
  secret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
