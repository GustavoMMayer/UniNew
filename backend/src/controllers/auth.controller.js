const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const resultado = await authService.login(username, password);
    res.json(resultado);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const resultado = await authService.logout(token);
    res.json(resultado);
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  logout
};
