const BaseRepository = require('./base.repository');

class GrausAcademicosRepository extends BaseRepository {
  constructor() {
    super('graus_academicos');
  }

  async findAll() {
    const sql = 'SELECT * FROM graus_academicos ORDER BY ordem ASC';
    const rows = await this.query(sql);
    
    return rows.map(row => ({
      id: row.id,
      nome: row.nome,
      ordem: row.ordem,
      created_at: row.created_at
    }));
  }
}

module.exports = new GrausAcademicosRepository();
