const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'uninew_user',
  password: process.env.DB_PASSWORD || 'uninew_pass',
  database: process.env.DB_NAME || 'uninew_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectTimeout: 10000,
  decimalNumbers: true,
  typeCast: function (field, next) {
    if (field.type === 'VAR_STRING' || field.type === 'STRING') {
      return field.string();
    }
    return next();
  }
};

const pool = mysql.createPool(dbConfig);

pool.on('connection', (connection) => {
  connection.query('SET NAMES utf8mb4');
  connection.query('SET CHARACTER SET utf8mb4');
  connection.query('SET character_set_connection=utf8mb4');
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SET NAMES utf8mb4');
    await connection.query('SET CHARACTER SET utf8mb4');
    console.log('✅ Conectado ao MySQL com sucesso!');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  testConnection
};
