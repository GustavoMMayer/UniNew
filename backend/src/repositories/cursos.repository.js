const BaseRepository = require('./base.repository');
const mockData = require('../mocks/data');

class CursosRepository extends BaseRepository {
  constructor() {
    super('cursos');
  }

  async findAll() {
    const sql = 'SELECT * FROM cursos';
    const rows = await this.query(sql);
    
    return rows.map(row => ({
      codigo: row.codigo,
      nome: row.nome,
      disciplinas: row.disciplinas || [],
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  async findByCodigo(codigo) {
    const sql = 'SELECT * FROM cursos WHERE codigo = ?';
    const rows = await this.query(sql, [codigo]);
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      codigo: row.codigo,
      nome: row.nome,
      disciplinas: row.disciplinas || [],
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  async create(data) {
    const sql = 'INSERT INTO cursos (codigo, nome, disciplinas) VALUES (?, ?, ?)';
    await this.query(sql, [
      data.codigo,
      data.nome,
      JSON.stringify(data.disciplinas || [])
    ]);
    
    return await this.findByCodigo(data.codigo);
  }

  async update(codigo, data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (key !== 'codigo') {
        if (key === 'disciplinas') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(data[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      }
    });
    
    if (fields.length === 0) return await this.findByCodigo(codigo);
    
    values.push(codigo);
    const sql = `UPDATE cursos SET ${fields.join(', ')} WHERE codigo = ?`;
    await this.query(sql, values);
    
    return await this.findByCodigo(codigo);
  }

  async delete(codigo) {
    const sql = 'DELETE FROM cursos WHERE codigo = ?';
    const result = await this.query(sql, [codigo]);
    return result.affectedRows > 0;
  }
}

module.exports = new CursosRepository();
