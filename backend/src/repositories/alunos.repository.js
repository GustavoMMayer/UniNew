const BaseRepository = require('./base.repository');
const mockData = require('../mocks/data');

class AlunosRepository extends BaseRepository {
  constructor() {
    super('alunos');
  }

  async findAll(filters = {}) {
    let sql = 'SELECT cpf, nome, email, telefone, tipo_conta, tipo_conta_id, curso, situacao FROM usuarios WHERE tipo_conta = "aluno"';
    const params = [];
    
    if (filters.curso) {
      sql += ' AND curso = ?';
      params.push(filters.curso);
    }
    if (filters.situacao) {
      sql += ' AND situacao = ?';
      params.push(filters.situacao);
    }
    
    return await this.query(sql, params);
  }

  async findByCpf(cpf) {
    const sql = 'SELECT cpf, nome, email, telefone, tipo_conta, tipo_conta_id, curso, situacao FROM usuarios WHERE cpf = ? AND tipo_conta = "aluno"';
    const rows = await this.query(sql, [cpf]);
    return rows[0] || null;
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
    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE cpf = ? AND tipo_conta = "aluno"`;
    await this.query(sql, values);
    
    return await this.findByCpf(cpf);
  }
}

module.exports = new AlunosRepository();
