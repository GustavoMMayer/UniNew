const BaseRepository = require('./base.repository');

class CursosRepository extends BaseRepository {
  constructor() {
    super('cursos');
  }

  async findAll() {
    const sql = 'SELECT * FROM cursos';
    const rows = await this.query(sql);
    
    return rows.map(row => ({
      id: row.id,
      nome: row.nome,
      disciplinas: row.disciplinas || [],
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  async findById(id) {
    const sql = 'SELECT * FROM cursos WHERE id = ?';
    const rows = await this.query(sql, [id]);
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      id: row.id,
      nome: row.nome,
      disciplinas: row.disciplinas || [],
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  async create(data) {
    const sql = 'INSERT INTO cursos (nome, disciplinas) VALUES (?, ?)';
    const result = await this.query(sql, [
      data.nome,
      JSON.stringify(data.disciplinas || [])
    ]);
    
    return await this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (key !== 'id') {
        if (key === 'disciplinas') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(data[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      }
    });
    
    if (fields.length === 0) return await this.findById(id);
    
    values.push(id);
    const sql = `UPDATE cursos SET ${fields.join(', ')} WHERE id = ?`;
    await this.query(sql, values);
    
    return await this.findById(id);
  }

  async delete(id) {
    const sql = 'DELETE FROM cursos WHERE id = ?';
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new CursosRepository();
