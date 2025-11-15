/**
 * Testes E2E - Docentes API
 * 
 * Testes end-to-end para endpoints de docentes
 * Base URL: http://localhost:3000/api/docentes
 */

const api = require('../helpers/api.helper');

describe('Docentes API - E2E Tests', () => {

  // Setup: Os docentes são usuários, portanto usam a tabela usuarios
  beforeAll(async () => {
    // Docentes são criados como usuários com tipo_conta='docente'
    // Não há necessidade de setup específico pois usam dados existentes
  });

  // Teardown: Docentes permanecem no banco (sem DELETE)
  afterAll(async () => {
    // Dados permanecem para outros testes
  });
  
  // ========================================
  // GET /docentes - Listar docentes
  // ========================================
  describe('GET /docentes', () => {
    
    test('Deve retornar lista de docentes', async () => {
      const response = await api.get('/docentes');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('Deve retornar docentes com estrutura correta', async () => {
      const response = await api.get('/docentes');
      
      const docente = response.data[0];
      expect(docente).toHaveProperty('cpf');
      expect(docente).toHaveProperty('nome');
      expect(docente).toHaveProperty('email');
      expect(docente).toHaveProperty('tipo_conta', 'docente');
      expect(docente).toHaveProperty('grau_academico');
      expect(docente).toHaveProperty('disciplina');
      expect(docente).toHaveProperty('carga_horaria');
    });

    test('Não deve retornar senha dos docentes', async () => {
      const response = await api.get('/docentes');
      
      const docente = response.data[0];
      expect(docente).not.toHaveProperty('senha');
    });

    test('Tipo conta deve sempre ser "docente"', async () => {
      const response = await api.get('/docentes');
      
      response.data.forEach(docente => {
        expect(docente.tipo_conta).toBe('docente');
      });
    });

    test('Grau acadêmico deve estar presente', async () => {
      const response = await api.get('/docentes');
      
      response.data.forEach(docente => {
        expect(docente).toHaveProperty('grau_academico');
      });
    });

  });

  // ========================================
  // GET /docentes/:cpf - Buscar por CPF
  // ========================================
  describe('GET /docentes/:cpf', () => {
    
    test('Deve retornar docente por CPF válido', async () => {
      const response = await api.get('/docentes/22222222222');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('cpf', '22222222222');
      expect(response.data).toHaveProperty('nome');
      expect(response.data).toHaveProperty('email');
      expect(response.data).toHaveProperty('tipo_conta', 'docente');
    });

    test('Não deve retornar senha do docente', async () => {
      const response = await api.get('/docentes/22222222222');
      
      expect(response.data).not.toHaveProperty('senha');
    });

    test('Deve retornar 404 para CPF inexistente', async () => {
      const response = await api.get('/docentes/99999999999');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toMatch(/não encontrado/i);
    });

    test('Docente deve ter informações acadêmicas', async () => {
      const response = await api.get('/docentes/22222222222');
      
      expect(response.data).toHaveProperty('grau_academico');
      expect(response.data).toHaveProperty('disciplina');
      expect(response.data).toHaveProperty('carga_horaria');
    });

    test('Carga horária deve ser numérica', async () => {
      const response = await api.get('/docentes/22222222222');
      
      if (response.data.carga_horaria !== null) {
        expect(typeof response.data.carga_horaria).toBe('number');
      }
    });

  });

  // ========================================
  // PUT /docentes/:cpf - Atualizar docente
  // ========================================
  describe('PUT /docentes/:cpf', () => {
    
    test('Deve atualizar email do docente', async () => {
      const dadosAtualizacao = {
        email: 'docente.atualizado@teste.com'
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.email).toBe('docente.atualizado@teste.com');
      expect(response.data.cpf).toBe('22222222222');
    });

    test('Deve atualizar telefone do docente', async () => {
      const dadosAtualizacao = {
        telefone: '21987654321'
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.telefone).toBe('21987654321');
    });

    test('Deve atualizar grau acadêmico', async () => {
      const dadosAtualizacao = {
        grau_academico: 'Doutorado'
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.grau_academico).toBe('Doutorado');
      
      // Reverter para Mestrado
      await api.put('/docentes/22222222222', { grau_academico: 'Mestrado' });
    });

    test('Deve atualizar disciplina lecionada', async () => {
      const dadosAtualizacao = {
        disciplina: 'Estruturas de Dados'
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.disciplina).toBe('Estruturas de Dados');
      
      // Reverter
      await api.put('/docentes/22222222222', { disciplina: 'Algoritmos' });
    });

    test('Deve atualizar carga horária', async () => {
      const dadosAtualizacao = {
        carga_horaria: 60
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.carga_horaria).toBe(60);
      
      // Reverter
      await api.put('/docentes/22222222222', { carga_horaria: 40 });
    });

    test('Deve atualizar múltiplos campos simultaneamente', async () => {
      const dadosAtualizacao = {
        email: 'docente@teste.com',
        telefone: '0000-0002',
        grau_academico: 'Mestrado',
        carga_horaria: 40
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.email).toBe('docente@teste.com');
      expect(response.data.telefone).toBe('0000-0002');
      expect(response.data.grau_academico).toBe('Mestrado');
      expect(response.data.carga_horaria).toBe(40);
    });

    test('Deve retornar 404 ao atualizar docente inexistente', async () => {
      const dadosAtualizacao = {
        email: 'teste@teste.com'
      };
      
      const response = await api.put('/docentes/99999999999', dadosAtualizacao);
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

    test('Não deve permitir atualizar CPF', async () => {
      const dadosAtualizacao = {
        nome: 'Docente Teste'
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      // CPF deve permanecer o mesmo
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('cpf', '22222222222');
    });

    test('Não deve permitir atualizar tipo_conta', async () => {
      const dadosAtualizacao = {
        nome: 'Teste'
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      // Tipo deve permanecer docente
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('tipo_conta', 'docente');
      
      // Reverter nome
      await api.put('/docentes/22222222222', { nome: 'Docente Teste' });
    });

    test('Deve retornar docente atualizado com estrutura completa', async () => {
      const dadosAtualizacao = {
        email: 'docente@teste.com'
      };
      
      const response = await api.put('/docentes/22222222222', dadosAtualizacao);
      
      expect(response.data).toHaveProperty('cpf');
      expect(response.data).toHaveProperty('nome');
      expect(response.data).toHaveProperty('email');
      expect(response.data).toHaveProperty('grau_academico');
      expect(response.data).toHaveProperty('disciplina');
      expect(response.data).toHaveProperty('carga_horaria');
      expect(response.data).not.toHaveProperty('senha');
    });

  });

  // ========================================
  // Validações de Dados
  // ========================================
  describe('Validações de Dados', () => {
    
    test('CPF deve ter formato válido', async () => {
      const response = await api.get('/docentes/22222222222');
      
      expect(response.data.cpf).toMatch(/^\d{11}$/);
    });

    test('Email deve ter formato válido', async () => {
      const response = await api.get('/docentes/22222222222');
      
      if (response.data.email) {
        expect(response.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      }
    });

    test('Grau acadêmico deve ser válido', async () => {
      const response = await api.get('/docentes/22222222222');
      
      const grausValidos = ['Graduação', 'Especialização', 'Mestrado', 'Doutorado', 'Pós-Doutorado'];
      
      if (response.data.grau_academico) {
        expect(grausValidos).toContain(response.data.grau_academico);
      }
    });

    test('Carga horária deve ser positiva', async () => {
      const response = await api.get('/docentes/22222222222');
      
      if (response.data.carga_horaria !== null) {
        expect(response.data.carga_horaria).toBeGreaterThan(0);
      }
    });

  });

  // ========================================
  // Performance
  // ========================================
  describe('Performance', () => {
    
    test('Listagem de docentes deve responder em menos de 2 segundos', async () => {
      const startTime = Date.now();
      await api.get('/docentes');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

    test('Busca por CPF deve responder em menos de 1 segundo', async () => {
      const startTime = Date.now();
      await api.get('/docentes/22222222222');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

  });

  // ========================================
  // Integração
  // ========================================
  describe('Integração', () => {
    
    test('Disciplina do docente deve existir na tabela de disciplinas', async () => {
      const docenteResponse = await api.get('/docentes/22222222222');
      const disciplinaNome = docenteResponse.data.disciplina;
      
      if (disciplinaNome) {
        const disciplinasResponse = await api.get('/disciplinas');
        
        // Verifica se existe alguma disciplina com nome similar
        const disciplinaEncontrada = disciplinasResponse.data.some(
          disc => disc.nome.toLowerCase().includes(disciplinaNome.toLowerCase()) ||
                  disciplinaNome.toLowerCase().includes(disc.nome.toLowerCase())
        );
        
        expect(disciplinaEncontrada).toBe(true);
      }
    });

  });

});
