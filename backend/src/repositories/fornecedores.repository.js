const BaseRepository = require('./base.repository');

class FornecedoresRepository extends BaseRepository {
  constructor() {
    super('fornecedores');
  }

  async findAll() {
    const sql = 'SELECT cnpj, razao_social, contatos, servicos FROM fornecedores';
    const rows = await this.query(sql);
    return rows.map(row => ({
      ...row,
      contatos: this.parseJSON(row.contatos, []),
      servicos: this.parseJSON(row.servicos, [])
    }));
  }

  async findByCnpj(cnpj) {
    const sql = 'SELECT cnpj, razao_social, contatos, servicos FROM fornecedores WHERE cnpj = ?';
    const rows = await this.query(sql, [cnpj]);
    if (rows.length === 0) return null;
    
    return {
      ...rows[0],
      contatos: this.parseJSON(rows[0].contatos, []),
      servicos: this.parseJSON(rows[0].servicos, [])
    };
  }

  parseJSON(value, defaultValue = null) {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch (e) {
      return defaultValue;
    }
  }

  async create(data) {
    const sql = 'INSERT INTO fornecedores (cnpj, razao_social, contatos, servicos) VALUES (?, ?, ?, ?)';
    await this.query(sql, [
      data.cnpj,
      data.razao_social,
      JSON.stringify(data.contatos),
      JSON.stringify(data.servicos)
    ]);
    
    return await this.findByCnpj(data.cnpj);
  }

  async update(cnpj, data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (key !== 'cnpj') {
        if (key === 'contatos' || key === 'servicos') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(data[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      }
    });
    
    if (fields.length === 0) return await this.findByCnpj(cnpj);
    
    values.push(cnpj);
    const sql = `UPDATE fornecedores SET ${fields.join(', ')} WHERE cnpj = ?`;
    await this.query(sql, values);
    
    return await this.findByCnpj(cnpj);
  }

  async delete(cnpj) {
    const sql = 'DELETE FROM fornecedores WHERE cnpj = ?';
    const result = await this.query(sql, [cnpj]);
    return result.affectedRows > 0;
  }
}

module.exports = new FornecedoresRepository();
