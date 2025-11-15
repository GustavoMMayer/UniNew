/**
 * Testes E2E - Fornecedores API
 * 
 * Testes end-to-end para endpoints de fornecedores
 * Base URL: http://localhost:3000/api/fornecedores
 */

const api = require('../helpers/api.helper');
const { fornecedoresFixture, cnpjsParaLimpar } = require('../fixtures/fornecedores.fixture');

describe('Fornecedores API - E2E Tests', () => {
  
  let fornecedorTesteCnpj = '12345678000190';

  // Setup: Limpar dados antes de todos os testes
  beforeAll(async () => {
    for (const cnpj of cnpjsParaLimpar) {
      await api.delete(`/fornecedores/${cnpj}`);
    }
    // Adicionar CNPJ do teste principal
    await api.delete(`/fornecedores/${fornecedorTesteCnpj}`);
  });

  // Teardown: Limpar dados após todos os testes
  afterAll(async () => {
    for (const cnpj of cnpjsParaLimpar) {
      await api.delete(`/fornecedores/${cnpj}`);
    }
    await api.delete(`/fornecedores/${fornecedorTesteCnpj}`);
  });

  // ========================================
  // POST /fornecedores - Criar fornecedor
  // ========================================
  describe('POST /fornecedores', () => {
    
    test('Deve criar novo fornecedor', async () => {
      const novoFornecedor = {
        cnpj: fornecedorTesteCnpj,
        razao_social: 'Empresa Teste LTDA',
        contatos: ['contato@teste.com', '11987654321'],
        servicos: ['Limpeza', 'Manutenção']
      };
      
      const response = await api.post('/fornecedores', novoFornecedor);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('cnpj', fornecedorTesteCnpj);
      expect(response.data).toHaveProperty('razao_social', 'Empresa Teste LTDA');
      expect(Array.isArray(response.data.contatos)).toBe(true);
      expect(Array.isArray(response.data.servicos)).toBe(true);
    });

    test('Contatos devem ser array de strings', async () => {
      const fornecedor = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(Array.isArray(fornecedor.data.contatos)).toBe(true);
      expect(fornecedor.data.contatos.length).toBeGreaterThan(0);
      fornecedor.data.contatos.forEach(contato => {
        expect(typeof contato).toBe('string');
      });
    });

    test('Serviços devem ser array de strings', async () => {
      const fornecedor = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(Array.isArray(fornecedor.data.servicos)).toBe(true);
      expect(fornecedor.data.servicos.length).toBeGreaterThan(0);
      fornecedor.data.servicos.forEach(servico => {
        expect(typeof servico).toBe('string');
      });
    });

    test('Deve rejeitar CNPJ com menos de 14 dígitos', async () => {
      const fornecedorInvalido = {
        cnpj: '123456789',
        razao_social: 'Teste',
        contatos: ['teste@teste.com'],
        servicos: ['Teste']
      };
      
      const response = await api.post('/fornecedores', fornecedorInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar CNPJ com mais de 14 dígitos', async () => {
      const fornecedorInvalido = {
        cnpj: '123456789012345',
        razao_social: 'Teste',
        contatos: ['teste@teste.com'],
        servicos: ['Teste']
      };
      
      const response = await api.post('/fornecedores', fornecedorInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar CNPJ com caracteres não numéricos', async () => {
      const fornecedorInvalido = {
        cnpj: '12.345.678/0001-90',
        razao_social: 'Teste',
        contatos: ['teste@teste.com'],
        servicos: ['Teste']
      };
      
      const response = await api.post('/fornecedores', fornecedorInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar fornecedor sem razão social', async () => {
      const fornecedorInvalido = {
        cnpj: '98765432000199',
        contatos: ['teste@teste.com'],
        servicos: ['Teste']
      };
      
      const response = await api.post('/fornecedores', fornecedorInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar fornecedor sem contatos', async () => {
      const fornecedorInvalido = {
        cnpj: '98765432000199',
        razao_social: 'Teste LTDA',
        servicos: ['Teste']
      };
      
      const response = await api.post('/fornecedores', fornecedorInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar fornecedor com array vazio de contatos', async () => {
      const fornecedorInvalido = {
        cnpj: '98765432000199',
        razao_social: 'Teste LTDA',
        contatos: [],
        servicos: ['Teste']
      };
      
      const response = await api.post('/fornecedores', fornecedorInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar fornecedor sem serviços', async () => {
      const fornecedorInvalido = {
        cnpj: '98765432000199',
        razao_social: 'Teste LTDA',
        contatos: ['teste@teste.com']
      };
      
      const response = await api.post('/fornecedores', fornecedorInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar fornecedor com array vazio de serviços', async () => {
      const fornecedorInvalido = {
        cnpj: '98765432000199',
        razao_social: 'Teste LTDA',
        contatos: ['teste@teste.com'],
        servicos: []
      };
      
      const response = await api.post('/fornecedores', fornecedorInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

  });

  // ========================================
  // GET /fornecedores - Listar fornecedores
  // ========================================
  describe('GET /fornecedores', () => {
    
    test('Deve retornar lista de fornecedores', async () => {
      const response = await api.get('/fornecedores');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('Deve retornar fornecedores com estrutura correta', async () => {
      const response = await api.get('/fornecedores');
      
      const fornecedor = response.data[0];
      expect(fornecedor).toHaveProperty('cnpj');
      expect(fornecedor).toHaveProperty('razao_social');
      expect(fornecedor).toHaveProperty('contatos');
      expect(fornecedor).toHaveProperty('servicos');
    });

    test('Contatos devem ser arrays', async () => {
      const response = await api.get('/fornecedores');
      
      response.data.forEach(fornecedor => {
        expect(Array.isArray(fornecedor.contatos)).toBe(true);
      });
    });

    test('Serviços devem ser arrays', async () => {
      const response = await api.get('/fornecedores');
      
      response.data.forEach(fornecedor => {
        expect(Array.isArray(fornecedor.servicos)).toBe(true);
      });
    });

  });

  // ========================================
  // GET /fornecedores/:cnpj - Buscar por CNPJ
  // ========================================
  describe('GET /fornecedores/:cnpj', () => {
    
    test('Deve retornar fornecedor por CNPJ válido', async () => {
      const response = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('cnpj', fornecedorTesteCnpj);
      expect(response.data).toHaveProperty('razao_social');
    });

    test('Deve retornar 404 para CNPJ inexistente', async () => {
      const response = await api.get('/fornecedores/99999999999999');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toMatch(/não encontrado/i);
    });

    test('Fornecedor deve ter contatos em formato de array', async () => {
      const response = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(Array.isArray(response.data.contatos)).toBe(true);
    });

    test('Fornecedor deve ter serviços em formato de array', async () => {
      const response = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(Array.isArray(response.data.servicos)).toBe(true);
    });

  });

  // ========================================
  // PUT /fornecedores/:cnpj - Atualizar fornecedor
  // ========================================
  describe('PUT /fornecedores/:cnpj', () => {
    
    test('Deve atualizar razão social', async () => {
      const dadosAtualizacao = {
        razao_social: 'Empresa Atualizada LTDA'
      };
      
      const response = await api.put(`/fornecedores/${fornecedorTesteCnpj}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.razao_social).toBe('Empresa Atualizada LTDA');
      
      // Reverter
      await api.put(`/fornecedores/${fornecedorTesteCnpj}`, { razao_social: 'Empresa Teste LTDA' });
    });

    test('Deve atualizar contatos', async () => {
      const dadosAtualizacao = {
        contatos: ['novo@teste.com', '11999999999', 'WhatsApp: 11888888888']
      };
      
      const response = await api.put(`/fornecedores/${fornecedorTesteCnpj}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.contatos).toEqual(['novo@teste.com', '11999999999', 'WhatsApp: 11888888888']);
      
      // Reverter
      await api.put(`/fornecedores/${fornecedorTesteCnpj}`, { contatos: ['contato@teste.com', '11987654321'] });
    });

    test('Deve atualizar serviços', async () => {
      const dadosAtualizacao = {
        servicos: ['Limpeza', 'Manutenção', 'Jardinagem', 'Segurança']
      };
      
      const response = await api.put(`/fornecedores/${fornecedorTesteCnpj}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.servicos).toEqual(['Limpeza', 'Manutenção', 'Jardinagem', 'Segurança']);
      
      // Reverter
      await api.put(`/fornecedores/${fornecedorTesteCnpj}`, { servicos: ['Limpeza', 'Manutenção'] });
    });

    test('Deve atualizar múltiplos campos simultaneamente', async () => {
      const dadosAtualizacao = {
        razao_social: 'Nova Empresa LTDA',
        contatos: ['contato@nova.com'],
        servicos: ['Consultoria']
      };
      
      const response = await api.put(`/fornecedores/${fornecedorTesteCnpj}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.razao_social).toBe('Nova Empresa LTDA');
      expect(response.data.contatos).toEqual(['contato@nova.com']);
      expect(response.data.servicos).toEqual(['Consultoria']);
      
      // Reverter
      await api.put(`/fornecedores/${fornecedorTesteCnpj}`, {
        razao_social: 'Empresa Teste LTDA',
        contatos: ['contato@teste.com', '11987654321'],
        servicos: ['Limpeza', 'Manutenção']
      });
    });

    test('Deve retornar 404 ao atualizar fornecedor inexistente', async () => {
      const dadosAtualizacao = {
        razao_social: 'Teste'
      };
      
      const response = await api.put('/fornecedores/99999999999999', dadosAtualizacao);
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

    test('Não deve permitir atualizar CNPJ', async () => {
      const dadosAtualizacao = {
        razao_social: 'Teste'
      };
      
      const response = await api.put(`/fornecedores/${fornecedorTesteCnpj}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('cnpj', fornecedorTesteCnpj);
      
      // Reverter
      await api.put(`/fornecedores/${fornecedorTesteCnpj}`, { razao_social: 'Empresa Teste LTDA' });
    });

    test('Deve rejeitar atualização com contatos vazio', async () => {
      const dadosAtualizacao = {
        contatos: []
      };
      
      const response = await api.put(`/fornecedores/${fornecedorTesteCnpj}`, dadosAtualizacao);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar atualização com serviços vazio', async () => {
      const dadosAtualizacao = {
        servicos: []
      };
      
      const response = await api.put(`/fornecedores/${fornecedorTesteCnpj}`, dadosAtualizacao);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

  });

  // ========================================
  // Validações de Dados
  // ========================================
  describe('Validações de Dados', () => {
    
    test('CNPJ deve ter formato válido', async () => {
      const response = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(response.data.cnpj).toMatch(/^\d{14}$/);
    });

    test('Razão social deve ser string não vazia', async () => {
      const response = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(typeof response.data.razao_social).toBe('string');
      expect(response.data.razao_social.length).toBeGreaterThan(0);
    });

    test('Contatos deve conter pelo menos um item', async () => {
      const response = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(response.data.contatos.length).toBeGreaterThan(0);
    });

    test('Serviços deve conter pelo menos um item', async () => {
      const response = await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      
      expect(response.data.servicos.length).toBeGreaterThan(0);
    });

  });

  // ========================================
  // Performance
  // ========================================
  describe('Performance', () => {
    
    test('Listagem de fornecedores deve responder em menos de 2 segundos', async () => {
      const startTime = Date.now();
      await api.get('/fornecedores');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

    test('Busca por CNPJ deve responder em menos de 1 segundo', async () => {
      const startTime = Date.now();
      await api.get(`/fornecedores/${fornecedorTesteCnpj}`);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

    test('Criação de fornecedor deve responder em menos de 2 segundos', async () => {
      const novoFornecedor = {
        cnpj: '99999999000199',
        razao_social: 'Performance Test LTDA',
        contatos: ['perf@test.com'],
        servicos: ['Testing']
      };
      
      const startTime = Date.now();
      await api.post('/fornecedores', novoFornecedor);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
      
      // Limpar
      await api.delete('/fornecedores/99999999000199');
    });

  });

  // ========================================
  // DELETE /fornecedores/:cnpj - Excluir fornecedor
  // ========================================
  describe('DELETE /fornecedores/:cnpj', () => {
    
    test('Deve excluir fornecedor existente', async () => {
      // Criar fornecedor temporário
      const fornecedorTemp = {
        cnpj: '11111111000111',
        razao_social: 'Temp LTDA',
        contatos: ['temp@test.com'],
        servicos: ['Temp']
      };
      await api.post('/fornecedores', fornecedorTemp);
      
      const response = await api.delete('/fornecedores/11111111000111');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data.message).toMatch(/excluído com sucesso/i);
    });

    test('Deve retornar informações do fornecedor excluído', async () => {
      // Criar fornecedor temporário
      const fornecedorTemp = {
        cnpj: '22222222000222',
        razao_social: 'Delete Test LTDA',
        contatos: ['delete@test.com'],
        servicos: ['Delete']
      };
      await api.post('/fornecedores', fornecedorTemp);
      
      const response = await api.delete('/fornecedores/22222222000222');
      
      expect(response.data).toHaveProperty('fornecedor');
      expect(response.data.fornecedor).toHaveProperty('cnpj', '22222222000222');
      expect(response.data.fornecedor).toHaveProperty('razao_social', 'Delete Test LTDA');
    });

    test('Deve retornar 404 ao excluir fornecedor inexistente', async () => {
      const response = await api.delete('/fornecedores/99999999999999');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

    test('Fornecedor excluído não deve mais existir no banco', async () => {
      // Criar e excluir
      const fornecedorTemp = {
        cnpj: '33333333000333',
        razao_social: 'Verify Delete LTDA',
        contatos: ['verify@test.com'],
        servicos: ['Verify']
      };
      await api.post('/fornecedores', fornecedorTemp);
      await api.delete('/fornecedores/33333333000333');
      
      // Verificar que não existe mais
      const response = await api.get('/fornecedores/33333333000333');
      expect(response.status).toBe(404);
    });

  });

});
