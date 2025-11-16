module.exports = {
  secret: process.env.JWT_SECRET || 'chave_secreta',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
