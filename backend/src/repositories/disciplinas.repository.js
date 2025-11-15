const BaseRepository = require('./base.repository');
const mockData = require('../mocks/data');

class DisciplinasRepository extends BaseRepository {
  constructor() {
    super('disciplinas');
  }

  async findAll() {
    const sql = 'SELECT * FROM disciplinas';
    return await this.query(sql);
  }

  async findByCodigo(codigo) {
    const sql = 'SELECT * FROM disciplinas WHERE codigo = ?';
    const rows = await this.query(sql, [codigo]);
    return rows[0] || null;
  }

  async create(data) {
    const sql = 'INSERT INTO disciplinas (codigo, nome, carga_horaria) VALUES (?, ?, ?)';
    await this.query(sql, [data.codigo, data.nome, data.carga_horaria]);
    return await this.findByCodigo(data.codigo);
  }

  async update(codigo, data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (key !== 'codigo') {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });
    
    if (fields.length === 0) return await this.findByCodigo(codigo);
    
    values.push(codigo);
    const sql = `UPDATE disciplinas SET ${fields.join(', ')} WHERE codigo = ?`;
    await this.query(sql, values);
    
    return await this.findByCodigo(codigo);
  }

  async delete(codigo) {
    const sql = 'DELETE FROM disciplinas WHERE codigo = ?';
    const result = await this.query(sql, [codigo]);
    return result.affectedRows > 0;
  }
}

module.exports = new DisciplinasRepository();
