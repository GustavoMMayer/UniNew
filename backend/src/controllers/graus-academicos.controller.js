const grausAcademicosService = require('../services/graus-academicos.service');

const listarGraus = async (req, res) => {
  try {
    const graus = await grausAcademicosService.listarGraus();
    res.json(graus);
  } catch (error) {
    console.error('Erro ao listar graus acadêmicos:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarGraus
};
