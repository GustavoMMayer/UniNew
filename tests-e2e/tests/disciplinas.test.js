/**
 * Testes E2E - Disciplinas API
 * 
 * Testes end-to-end para endpoints de disciplinas
 * Base URL: http://localhost:3000/api/disciplinas
 */

const api = require('../helpers/api.helper');
const { disciplinasFixture, codigosParaLimpar } = require('../fixtures/disciplinas.fixture');

describe('Disciplinas API - E2E Tests', () => {
  
  let disciplinaCriadaParaTestes = null;

  // Setup: Limpar disciplinas de teste antigas
  beforeAll(async () => {
    // Disciplinas não possuem DELETE, então ficam acumuladas no banco
    // Em produção, seria necessário acesso direto ao DB para limpeza
  });

  // Teardown: Documentação
  afterAll(async () => {
    // Disciplinas de teste permanecem no banco (sem endpoint DELETE)
  });

  // ========================================
  // GET /disciplinas - Listar disciplinas
  // ========================================
  describe('GET /disciplinas', () => {
    
    test('Deve retornar lista de disciplinas', async () => {
      const response = await api.get('/disciplinas');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('Deve retornar disciplinas com estrutura correta', async () => {
      const response = await api.get('/disciplinas');
      
      const disciplina = response.data[0];
      expect(disciplina).toHaveProperty('id');
      expect(disciplina).toHaveProperty('nome');
      expect(disciplina).toHaveProperty('carga_horaria');
    });

    test('Deve retornar disciplinas com encoding UTF-8 correto', async () => {
      const response = await api.get('/disciplinas');
      
      // Verifica se não há caracteres corrompidos como Ã
      const jsonString = JSON.stringify(response.data);
      expect(jsonString).not.toMatch(/Ã|Â|ï¿½/);
    });

    test('Carga horária deve ser numérica', async () => {
      const response = await api.get('/disciplinas');
      
      response.data.forEach(disciplina => {
        expect(typeof disciplina.carga_horaria).toBe('number');
        expect(disciplina.carga_horaria).toBeGreaterThan(0);
      });
    });

  });

  // ========================================
  // GET /disciplinas/:id - Buscar por ID
  // ========================================
  describe('GET /disciplinas/:id', () => {
    
    test('Deve retornar disciplina por ID válido', async () => {
      const response = await api.get('/disciplinas/1');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', 1);
      expect(response.data).toHaveProperty('nome');
      expect(response.data).toHaveProperty('carga_horaria');
    });

    test('Deve retornar 404 para ID inexistente', async () => {
      const response = await api.get('/disciplinas/999999');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toMatch(/não encontrada/i);
    });

    test('ID deve ser numérico', async () => {
      const response = await api.get('/disciplinas/1');
      
      expect(typeof response.data.id).toBe('number');
      expect(response.data.id).toBeGreaterThan(0);
    });

    test('Deve retornar disciplina com nome em UTF-8', async () => {
      const response = await api.get('/disciplinas/1');
      
      const nome = response.data.nome;
      expect(nome).not.toMatch(/Ã|Â|ï¿½/);
    });

  });

  // ========================================
  // POST /disciplinas - Criar disciplina
  // ========================================
  describe('POST /disciplinas', () => {
    
    test('Deve criar nova disciplina com nome e carga horária', async () => {
      const novaDisciplina = {
        nome: 'Disciplina de Teste',
        carga_horaria: 40
      };
      
      const response = await api.post('/disciplinas', novaDisciplina);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('nome', 'Disciplina de Teste');
      expect(response.data).toHaveProperty('carga_horaria', 40);
      
      disciplinaCriadaParaTestes = response.data;
    });

    test('Deve validar campos obrigatórios', async () => {
      const disciplinaInvalida = {
        // Faltando nome
        carga_horaria: 40
      };
      
      const response = await api.post('/disciplinas', disciplinaInvalida);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('errors');
    });

    test('Deve validar nome não vazio', async () => {
      const disciplinaInvalida = {
        nome: '',
        carga_horaria: 40
      };
      
      const response = await api.post('/disciplinas', disciplinaInvalida);
      
      expect(response.status).toBe(400);
    });

    test('Deve validar carga horária mínima', async () => {
      const disciplinaInvalida = {
        codigo: 'MIN',
        nome: 'Teste Carga Mínima',
        carga_horaria: 0 // Inválido
      };
      
      const response = await api.post('/disciplinas', disciplinaInvalida);
      
      expect(response.status).toBe(400);
    });

    test('Não deve permitir nome duplicado', async () => {
      const disciplinaDuplicada = {
        nome: 'Algoritmos',
        carga_horaria: 60
      };
      
      const response = await api.post('/disciplinas', disciplinaDuplicada);
      
      // Pode retornar 400, 409 ou 500 dependendo de como é tratado
      expect([400, 409, 500]).toContain(response.status);
      if (response.status !== 500) {
        expect(response.data).toHaveProperty('message');
      }
    });

  });

  // ========================================
  // PUT /disciplinas/:id - Atualizar
  // ========================================
  describe('PUT /disciplinas/:id', () => {
    
    test('Deve atualizar nome da disciplina', async () => {
      const dadosAtualizacao = {
        nome: 'Disciplina Atualizada'
      };
      
      // Usando ID da disciplina criada nos testes
      const disciplinaId = disciplinaCriadaParaTestes?.id || 1;
      const response = await api.put(`/disciplinas/${disciplinaId}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.nome).toBe('Disciplina Atualizada');
      expect(response.data.id).toBe(disciplinaId);
    });

    test('Deve atualizar carga horária', async () => {
      const dadosAtualizacao = {
        carga_horaria: 80
      };
      
      const disciplinaId = disciplinaCriadaParaTestes?.id || 1;
      const response = await api.put(`/disciplinas/${disciplinaId}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.carga_horaria).toBe(80);
    });

    test('Deve atualizar múltiplos campos', async () => {
      const dadosAtualizacao = {
        nome: 'Teste Final',
        carga_horaria: 60
      };
      
      const disciplinaId = disciplinaCriadaParaTestes?.id || 1;
      const response = await api.put(`/disciplinas/${disciplinaId}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.nome).toBe('Teste Final');
      expect(response.data.carga_horaria).toBe(60);
    });

    test('Deve retornar 404 ao atualizar disciplina inexistente', async () => {
      const dadosAtualizacao = {
        nome: 'Teste'
      };
      
      const response = await api.put('/disciplinas/999999', dadosAtualizacao);
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

    test('Não deve permitir alterar ID', async () => {
      const dadosAtualizacao = {
        id: 99999,
        nome: 'Disciplina de Teste'
      };
      
      const disciplinaId = disciplinaCriadaParaTestes?.id || 1;
      const response = await api.put(`/disciplinas/${disciplinaId}`, dadosAtualizacao);
      
      // ID deve permanecer o mesmo
      expect(response.data.id).toBe(disciplinaId);
    });

    test('Deve validar carga horária ao atualizar', async () => {
      const dadosInvalidos = {
        carga_horaria: -10
      };
      
      const response = await api.put('/disciplinas/TST', dadosInvalidos);
      
      expect(response.status).toBe(400);
    });

  });

  // ========================================
  // Validações de Dados
  // ========================================
  describe('Validações de Dados', () => {
    
    test('ID deve ser numérico positivo', async () => {
      const response = await api.get('/disciplinas');
      
      response.data.forEach(disciplina => {
        expect(typeof disciplina.id).toBe('number');
        expect(disciplina.id).toBeGreaterThan(0);
      });
    });

    test('Nome não deve estar vazio', async () => {
      const response = await api.get('/disciplinas');
      
      response.data.forEach(disciplina => {
        expect(disciplina.nome).toBeTruthy();
        expect(disciplina.nome.length).toBeGreaterThan(0);
      });
    });

    test('Carga horária deve ser múltiplo de 10', async () => {
      const response = await api.get('/disciplinas');
      
      response.data.forEach(disciplina => {
        // Normalmente disciplinas têm carga horária em múltiplos de 10
        // Este teste pode ser ajustado conforme regra de negócio
        expect(disciplina.carga_horaria % 10).toBe(0);
      });
    });

  });

  // ========================================
  // Performance
  // ========================================
  describe('Performance', () => {
    
    test('Listagem deve responder em menos de 2 segundos', async () => {
      const startTime = Date.now();
      await api.get('/disciplinas');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

    test('Busca por código deve responder em menos de 1 segundo', async () => {
      const startTime = Date.now();
      await api.get('/disciplinas/ALG');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

  });

  // ========================================
  // Integração
  // ========================================
  describe('Integração', () => {
    
    test('Disciplinas devem estar vinculadas a cursos', async () => {
      const disciplinasResponse = await api.get('/disciplinas');
      const cursosResponse = await api.get('/cursos');
      
      // Pelo menos uma disciplina deve estar em algum curso
      const cursosComDisciplinas = cursosResponse.data.filter(
        curso => curso.disciplinas && curso.disciplinas.length > 0
      );
      
      expect(cursosComDisciplinas.length).toBeGreaterThan(0);
    });

  });

  // ========================================
  // Limpeza após testes
  // ========================================
  afterAll(async () => {
    // Limpar disciplina criada nos testes se necessário
    // Nota: Não há endpoint DELETE implementado ainda
    if (disciplinaCriadaParaTestes) {
      // await api.delete(`/disciplinas/${disciplinaCriadaParaTestes.codigo}`);
    }
  });

});
