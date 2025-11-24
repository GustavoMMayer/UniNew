const grausAcademicosRepository = require('../repositories/graus-academicos.repository');

class GrausAcademicosService {
  async listarGraus() {
    return await grausAcademicosRepository.findAll();
  }
}

module.exports = new GrausAcademicosService();
