const BaseRepository = require('./base.repository');

class DisciplinasRepository extends BaseRepository {
  constructor() {
    super('disciplinas');
  }

  async findAll() {
    const sql = 'SELECT * FROM disciplinas';
    return await this.query(sql);
  }

  async findById(id) {
    const sql = 'SELECT * FROM disciplinas WHERE id = ?';
    const rows = await this.query(sql, [id]);
    return rows[0] || null;
  }

  async create(data) {
    const sql = 'INSERT INTO disciplinas (nome, carga_horaria) VALUES (?, ?)';
    const result = await this.query(sql, [data.nome, data.carga_horaria]);
    return await this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });
    
    if (fields.length === 0) return await this.findById(id);
    
    values.push(id);
    const sql = `UPDATE disciplinas SET ${fields.join(', ')} WHERE id = ?`;
    await this.query(sql, values);
    
    return await this.findById(id);
  }

  async delete(id) {
    const sql = 'DELETE FROM disciplinas WHERE id = ?';
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new DisciplinasRepository();
