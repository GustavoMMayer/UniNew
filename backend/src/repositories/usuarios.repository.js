const BaseRepository = require('./base.repository');
const mockData = require('../mocks/data');

class UsuariosRepository extends BaseRepository {
  constructor() {
    super('usuarios');
  }

  async findAll(filters = {}) {
    let sql = 'SELECT cpf, nome, email, telefone, tipo_conta, tipo_conta_id, curso, situacao, grau_academico, disciplina, carga_horaria FROM usuarios';
    const conditions = [];
    const params = [];
    
    if (filters.tipo_conta) {
      conditions.push('tipo_conta = ?');
      params.push(filters.tipo_conta);
    }
    if (filters.curso) {
      conditions.push('curso = ?');
      params.push(filters.curso);
    }
    if (filters.situacao) {
      conditions.push('situacao = ?');
      params.push(filters.situacao);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    return await this.query(sql, params);
  }

  async findByCpf(cpf) {
    const sql = 'SELECT cpf, nome, email, telefone, tipo_conta, tipo_conta_id, curso, situacao, grau_academico, disciplina, carga_horaria FROM usuarios WHERE cpf = ?';
    const rows = await this.query(sql, [cpf]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const sql = 'SELECT cpf, nome, email, telefone, tipo_conta, tipo_conta_id, curso, situacao, grau_academico, disciplina, carga_horaria FROM usuarios WHERE email = ?';
    const rows = await this.query(sql, [email]);
    return rows[0] || null;
  }

  async findForAuth(identifier) {
    const sql = 'SELECT * FROM usuarios WHERE cpf = ? OR email = ?';
    const rows = await this.query(sql, [identifier, identifier]);
    return rows[0] || null;
  }

  async create(data) {
    const sql = `INSERT INTO usuarios 
      (cpf, nome, email, telefone, senha, tipo_conta, tipo_conta_id, curso, situacao, grau_academico, disciplina, carga_horaria) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    await this.query(sql, [
      data.cpf,
      data.nome,
      data.email,
      data.telefone || null,
      data.senha,
      data.tipo_conta,
      data.tipo_conta_id,
      data.curso || null,
      data.situacao || null,
      data.grau_academico || null,
      data.disciplina || null,
      data.carga_horaria || null
    ]);
    
    return await this.findByCpf(data.cpf);
  }

  async update(cpf, data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (key !== 'cpf') {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });
    
    if (fields.length === 0) return await this.findByCpf(cpf);
    
    values.push(cpf);
    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE cpf = ?`;
    await this.query(sql, values);
    
    return await this.findByCpf(cpf);
  }

  async delete(cpf) {
    const sql = 'DELETE FROM usuarios WHERE cpf = ?';
    const result = await this.query(sql, [cpf]);
    return result.affectedRows > 0;
  }
}

module.exports = new UsuariosRepository();
