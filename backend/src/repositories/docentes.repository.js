const BaseRepository = require('./base.repository');
const mockData = require('../mocks/data');

class DocentesRepository extends BaseRepository {
  constructor() {
    super('docentes');
  }

  async findAll() {
    const sql = 'SELECT cpf, nome, email, telefone, tipo_conta, tipo_conta_id, grau_academico, disciplina, carga_horaria FROM usuarios WHERE tipo_conta = "docente"';
    return await this.query(sql);
  }

  async findByCpf(cpf) {
    const sql = 'SELECT cpf, nome, email, telefone, tipo_conta, tipo_conta_id, grau_academico, disciplina, carga_horaria FROM usuarios WHERE cpf = ? AND tipo_conta = "docente"';
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
    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE cpf = ? AND tipo_conta = "docente"`;
    await this.query(sql, values);
    
    return await this.findByCpf(cpf);
  }
}

module.exports = new DocentesRepository();
