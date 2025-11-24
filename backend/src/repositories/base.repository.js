const { pool } = require('../config/database');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async findAll(filters = {}) {
    const conditions = Object.keys(filters).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(filters);
    const sql = conditions 
      ? `SELECT * FROM ${this.tableName} WHERE ${conditions}`
      : `SELECT * FROM ${this.tableName}`;
    return await this.query(sql, values);
  }

  async findById(id, idField = 'id') {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${idField} = ? LIMIT 1`;
    const rows = await this.query(sql, [id]);
    return rows[0] || null;
  }

  async findOne(conditions) {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    const where = keys.map(key => `${key} = ?`).join(' AND ');
    const sql = `SELECT * FROM ${this.tableName} WHERE ${where} LIMIT 1`;
    const rows = await this.query(sql, values);
    return rows[0] || null;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    await this.query(sql, values);
    return data;
  }

  async update(id, data, idField = 'id') {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const sets = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${sets} WHERE ${idField} = ?`;
    await this.query(sql, [...values, id]);
    return await this.findById(id, idField);
  }

  async delete(id, idField = 'id') {
    const sql = `DELETE FROM ${this.tableName} WHERE ${idField} = ?`;
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }

  async count(filters = {}) {
    const conditions = Object.keys(filters).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(filters);
    const sql = conditions
      ? `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${conditions}`
      : `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const rows = await this.query(sql, values);
    return rows[0].total;
  }

  async exists(id, idField = 'id') {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE ${idField} = ? LIMIT 1`;
    const rows = await this.query(sql, [id]);
    return rows.length > 0;
  }
}

module.exports = BaseRepository;
