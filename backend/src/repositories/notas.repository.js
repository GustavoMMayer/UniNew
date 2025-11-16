const BaseRepository = require('./base.repository');

class NotasRepository extends BaseRepository {
  constructor() {
    super('notas');
  }

  async findAll(filters = {}) {
    let sql = 'SELECT * FROM notas';
    const params = [];
    
    if (filters.disciplina_codigo) {
      sql += ' WHERE disciplina_codigo = ?';
      params.push(filters.disciplina_codigo);
    }
    
    sql += ' ORDER BY created_at DESC';
    return await this.query(sql, params);
  }

  async findByAluno(cpf) {
    const sql = 'SELECT * FROM notas WHERE cpf = ? ORDER BY created_at DESC';
    return await this.query(sql, [cpf]);
  }

  async findById(id) {
    const sql = 'SELECT * FROM notas WHERE id = ?';
    const rows = await this.query(sql, [id]);
    return rows[0] || null;
  }

  async create(data) {
    const sql = `INSERT INTO notas 
      (id, cpf, disciplina, disciplina_codigo, nota, descricao) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    
    await this.query(sql, [
      data.id,
      data.cpf,
      data.disciplina,
      data.disciplina_codigo,
      data.nota,
      data.descricao || null
    ]);
    
    return await this.findById(data.id);
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
    const sql = `UPDATE notas SET ${fields.join(', ')} WHERE id = ?`;
    await this.query(sql, values);
    
    return await this.findById(id);
  }

  async delete(id) {
    const sql = 'DELETE FROM notas WHERE id = ?';
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new NotasRepository();
