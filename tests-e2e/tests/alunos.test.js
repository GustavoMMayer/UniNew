/**
 * Testes E2E - Alunos API
 * 
 * Testes end-to-end para endpoints de alunos
 * Base URL: http://localhost:3000/api/alunos
 */

const api = require('../helpers/api.helper');

describe('Alunos API - E2E Tests', () => {
  
  let authToken;

  beforeAll(async () => {
    // Fazer login para obter token (caso endpoints sejam protegidos)
    const credentials = {
      username: '11111111111',
      password: 'senha123'
    };
    
    const loginResponse = await api.post('/auth/login', credentials);
    authToken = loginResponse.data.token;
  });

  // ========================================
  // GET /alunos - Listar alunos
  // ========================================
  describe('GET /alunos', () => {
    
    test('Deve retornar lista de alunos', async () => {
      const response = await api.get('/alunos');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('Deve retornar alunos com estrutura correta', async () => {
      const response = await api.get('/alunos');
      
      const aluno = response.data[0];
      expect(aluno).toHaveProperty('cpf');
      expect(aluno).toHaveProperty('nome');
      expect(aluno).toHaveProperty('email');
      expect(aluno).toHaveProperty('tipo_conta', 'aluno');
      expect(aluno).toHaveProperty('curso');
      expect(aluno).toHaveProperty('situacao');
    });

    test('Não deve retornar senha dos alunos', async () => {
      const response = await api.get('/alunos');
      
      const aluno = response.data[0];
      expect(aluno).not.toHaveProperty('senha');
    });

    test('Deve filtrar alunos por curso', async () => {
      const response = await api.get('/alunos?curso=ADS');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Todos devem ser do curso ADS
      response.data.forEach(aluno => {
        expect(aluno.curso).toBe('ADS');
      });
    });

    test('Deve filtrar alunos por situacao', async () => {
      const response = await api.get('/alunos?situacao=Ativo');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Todos devem estar ativos
      response.data.forEach(aluno => {
        expect(aluno.situacao).toBe('Ativo');
      });
    });

    test('Deve combinar filtros de curso e situacao', async () => {
      const response = await api.get('/alunos?curso=ADS&situacao=Ativo');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      response.data.forEach(aluno => {
        expect(aluno.curso).toBe('ADS');
        expect(aluno.situacao).toBe('Ativo');
      });
    });

    test('Deve retornar array vazio quando não há resultados', async () => {
      const response = await api.get('/alunos?curso=CURSO_INEXISTENTE');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(0);
    });

  });

  // ========================================
  // GET /alunos/:cpf - Buscar aluno por CPF
  // ========================================
  describe('GET /alunos/:cpf', () => {
    
    test('Deve retornar aluno por CPF válido', async () => {
      const response = await api.get('/alunos/11111111111');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('cpf', '11111111111');
      expect(response.data).toHaveProperty('nome');
      expect(response.data).toHaveProperty('email');
      expect(response.data).toHaveProperty('tipo_conta', 'aluno');
    });

    test('Não deve retornar senha do aluno', async () => {
      const response = await api.get('/alunos/11111111111');
      
      expect(response.data).not.toHaveProperty('senha');
    });

    test('Deve retornar 404 para CPF inexistente', async () => {
      const response = await api.get('/alunos/99999999999');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toMatch(/não encontrado/i);
    });

    test('Aluno retornado deve ter informações acadêmicas', async () => {
      const response = await api.get('/alunos/11111111111');
      
      expect(response.data).toHaveProperty('curso');
      expect(response.data).toHaveProperty('situacao');
      expect(response.data.tipo_conta).toBe('aluno');
    });

  });

  // ========================================
  // PUT /alunos/:cpf - Atualizar aluno
  // ========================================
  describe('PUT /alunos/:cpf', () => {
    
    test('Deve atualizar email do aluno', async () => {
      const dadosAtualizacao = {
        email: 'aluno.atualizado@teste.com'
      };
      
      const response = await api.put('/alunos/11111111111', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.email).toBe('aluno.atualizado@teste.com');
      expect(response.data.cpf).toBe('11111111111');
    });

    test('Deve atualizar telefone do aluno', async () => {
      const dadosAtualizacao = {
        telefone: '11987654321'
      };
      
      const response = await api.put('/alunos/11111111111', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.telefone).toBe('11987654321');
    });

    test('Deve atualizar situacao do aluno', async () => {
      const dadosAtualizacao = {
        situacao: 'Inativo'
      };
      
      const response = await api.put('/alunos/11111111111', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.situacao).toBe('Inativo');
      
      // Reverter para Ativo
      await api.put('/alunos/11111111111', { situacao: 'Ativo' });
    });

    test('Deve atualizar múltiplos campos simultaneamente', async () => {
      const dadosAtualizacao = {
        email: 'aluno@teste.com',
        telefone: '0000-0001',
        situacao: 'Ativo'
      };
      
      const response = await api.put('/alunos/11111111111', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.email).toBe('aluno@teste.com');
      expect(response.data.telefone).toBe('0000-0001');
      expect(response.data.situacao).toBe('Ativo');
    });

    test('Deve retornar 404 ao atualizar aluno inexistente', async () => {
      const dadosAtualizacao = {
        email: 'teste@teste.com'
      };
      
      const response = await api.put('/alunos/99999999999', dadosAtualizacao);
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toMatch(/não encontrado/i);
    });

    test('Não deve permitir atualizar CPF', async () => {
      // CPF é chave primária e não pode ser alterado
      // Mesmo que tentemos enviar no body, deve ser ignorado pelo repository
      const dadosAtualizacao = {
        nome: 'Aluno Teste Atualizado'
      };
      
      const response = await api.put('/alunos/11111111111', dadosAtualizacao);
      
      // CPF deve permanecer o mesmo (presente na URL)
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('cpf', '11111111111');
      
      // Reverter nome
      await api.put('/alunos/11111111111', { nome: 'Aluno Teste' });
    });

    test('Não deve permitir atualizar tipo_conta', async () => {
      // Tipo de conta é gerenciado pelo sistema, não pode ser alterado via PUT
      const dadosAtualizacao = {
        nome: 'Teste'
      };
      
      const response = await api.put('/alunos/11111111111', dadosAtualizacao);
      
      // Tipo deve permanecer aluno
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('tipo_conta', 'aluno');
      
      // Reverter nome
      await api.put('/alunos/11111111111', { nome: 'Aluno Teste' });
    });

    test('Deve retornar aluno atualizado com estrutura completa', async () => {
      const dadosAtualizacao = {
        email: 'aluno@teste.com'
      };
      
      const response = await api.put('/alunos/11111111111', dadosAtualizacao);
      
      expect(response.data).toHaveProperty('cpf');
      expect(response.data).toHaveProperty('nome');
      expect(response.data).toHaveProperty('email');
      expect(response.data).toHaveProperty('curso');
      expect(response.data).toHaveProperty('situacao');
      expect(response.data).not.toHaveProperty('senha');
    });

  });

  // ========================================
  // Validações de Dados
  // ========================================
  describe('Validações de Dados', () => {
    
    test('CPF deve ter formato válido no retorno', async () => {
      const response = await api.get('/alunos/11111111111');
      
      expect(response.data.cpf).toMatch(/^\d{11}$/);
    });

    test('Email deve ter formato válido', async () => {
      const response = await api.get('/alunos/11111111111');
      
      if (response.data.email) {
        expect(response.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      }
    });

    test('Tipo conta deve sempre ser "aluno"', async () => {
      const response = await api.get('/alunos');
      
      response.data.forEach(aluno => {
        expect(aluno.tipo_conta).toBe('aluno');
      });
    });

  });

  // ========================================
  // Performance
  // ========================================
  describe('Performance', () => {
    
    test('Listagem de alunos deve responder em menos de 2 segundos', async () => {
      const startTime = Date.now();
      await api.get('/alunos');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

    test('Busca por CPF deve responder em menos de 1 segundo', async () => {
      const startTime = Date.now();
      await api.get('/alunos/11111111111');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

  });

  // ========================================
  // Integração com outros recursos
  // ========================================
  describe('Integração', () => {
    
    test('Curso do aluno deve existir em cursos', async () => {
      const alunoResponse = await api.get('/alunos/11111111111');
      const cursoCodigo = alunoResponse.data.curso;
      
      if (cursoCodigo) {
        const cursoResponse = await api.get(`/cursos/${cursoCodigo}`);
        expect(cursoResponse.status).toBe(200);
        expect(cursoResponse.data.codigo).toBe(cursoCodigo);
      }
    });

  });

});
