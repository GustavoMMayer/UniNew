const axios = require('axios');
const { execSync } = require('child_process');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  validateStatus: () => true,
});

async function query(sql, params = []) {
  let processedSql = sql;
  
  if (params && params.length > 0) {
    params.forEach((param) => {
      if (Array.isArray(param)) {
        const placeholders = param.map(p => `'${p}'`).join(',');
        processedSql = processedSql.replace('(?)', `(${placeholders})`);
      } else {
        processedSql = processedSql.replace('?', `'${param}'`);
      }
    });
  }
  
  const escapedSql = processedSql.replace(/"/g, '\\"');
  const command = `docker exec uninew-mysql mysql -uuninew_user -puninew_pass uninew_db -e "${escapedSql}"`;
  
  try {
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error('Erro ao executar query:', error.message);
    throw error;
  }
}

async function executeQuery(sql) {
  return await query(sql);
}

/**
 * Limpa dados de teste de uma tabela específica
 * @param {string} table - Nome da tabela
 * @param {string} whereClause - Cláusula WHERE para deletar registros específicos
 */
async function cleanupTable(table, whereClause) {
  const query = `DELETE FROM ${table} ${whereClause ? `WHERE ${whereClause}` : ''}`;
  return query;
}

/**
 * Cria usuário de teste via API
 * @param {object} userData - Dados do usuário
 * @returns {Promise<object>} Usuário criado
 */
async function createTestUser(userData) {
  const response = await api.post('/usuarios', userData);
  if (response.status === 201) {
    return response.data;
  }
  throw new Error(`Erro ao criar usuário: ${response.status}`);
}

/**
 * Cria disciplina de teste via API
 * @param {object} disciplinaData - Dados da disciplina
 * @returns {Promise<object>} Disciplina criada
 */
async function createTestDisciplina(disciplinaData) {
  const response = await api.post('/disciplinas', disciplinaData);
  if (response.status === 201) {
    return response.data;
  }
  throw new Error(`Erro ao criar disciplina: ${response.status}`);
}

/**
 * Cria fornecedor de teste via API
 * @param {object} fornecedorData - Dados do fornecedor
 * @returns {Promise<object>} Fornecedor criado
 */
async function createTestFornecedor(fornecedorData) {
  const response = await api.post('/fornecedores', fornecedorData);
  if (response.status === 201) {
    return response.data;
  }
  throw new Error(`Erro ao criar fornecedor: ${response.status}`);
}

/**
 * Deleta usuário via API
 * @param {string} cpf - CPF do usuário
 */
async function deleteTestUser(cpf) {
  await api.delete(`/usuarios/${cpf}`);
}

/**
 * Deleta fornecedor via API
 * @param {string} cnpj - CNPJ do fornecedor
 */
async function deleteTestFornecedor(cnpj) {
  await api.delete(`/fornecedores/${cnpj}`);
}

module.exports = {
  query,
  executeQuery,
  cleanupTable,
  createTestUser,
  createTestDisciplina,
  createTestFornecedor,
  deleteTestUser,
  deleteTestFornecedor,
  api,
};
