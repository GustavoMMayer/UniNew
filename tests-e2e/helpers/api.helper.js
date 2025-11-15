const axios = require('axios');
const config = require('../config/test.config');

class ApiHelper {
  constructor() {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
      validateStatus: () => true // Não lançar erro em status != 2xx
    });
  }

  async get(url, options = {}) {
    return await this.client.get(url, options);
  }

  async post(url, data, options = {}) {
    return await this.client.post(url, data, options);
  }

  async put(url, data, options = {}) {
    return await this.client.put(url, data, options);
  }

  async delete(url, options = {}) {
    return await this.client.delete(url, options);
  }

  /**
   * Extrai dados da resposta ou retorna erro
   */
  extractData(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    throw new Error(`API Error: ${response.status} - ${JSON.stringify(response.data)}`);
  }

  /**
   * Verifica se a resposta tem o status esperado
   */
  expectStatus(response, expectedStatus) {
    expect(response.status).toBe(expectedStatus);
    return this;
  }

  /**
   * Verifica se a resposta contém uma propriedade
   */
  expectProperty(response, property) {
    expect(response.data).toHaveProperty(property);
    return this;
  }

  /**
   * Verifica se a resposta é um array
   */
  expectArray(response) {
    expect(Array.isArray(response.data)).toBe(true);
    return this;
  }
}

module.exports = new ApiHelper();
