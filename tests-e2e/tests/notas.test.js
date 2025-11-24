/**
 * Testes E2E - Notas API
 * 
 * Testes end-to-end para endpoints de notas
 * Base URL: http://localhost:3000/api/notas
 */

const api = require('../helpers/api.helper');
const { usuariosFixture, cpfsParaLimpar } = require('../fixtures/usuarios.fixture');
const { disciplinasFixture, nomesParaLimpar } = require('../fixtures/disciplinas.fixture');
const db = require('../helpers/database');

describe('Notas API - E2E Tests', () => {
  
  const cpfAluno = usuariosFixture.aluno.cpf;
  let notaTesteId;
  let disciplinaTesteId;
  let disciplinaRedId;

  beforeAll(async () => {
    await db.query('DELETE FROM notas WHERE cpf IN (?)', [cpfsParaLimpar]);
    await db.query('DELETE FROM disciplinas WHERE nome IN (?)', [nomesParaLimpar]);
    await db.query('DELETE FROM usuarios WHERE cpf IN (?)', [cpfsParaLimpar]);
    
    await api.post('/usuarios', usuariosFixture.aluno);
    const discResp = await api.post('/disciplinas', disciplinasFixture.teste);
    disciplinaTesteId = discResp.data.id;
    const redResp = await api.post('/disciplinas', { nome: 'Redes de Computadores', carga_horaria: 60 });
    disciplinaRedId = redResp.data.id;
  });

  afterAll(async () => {
    await db.query('DELETE FROM notas WHERE cpf IN (?)', [cpfsParaLimpar]);
    await db.query('DELETE FROM disciplinas WHERE nome IN (?)', [nomesParaLimpar]);
    await db.query('DELETE FROM usuarios WHERE cpf IN (?)', [cpfsParaLimpar]);
  });

  // ========================================
  // POST /notas - Criar nota
  // ========================================
  describe('POST /notas', () => {
    
    test('Deve criar nova nota', async () => {
      const novaNota = {
        cpf: cpfAluno,
        disciplina: 'Algoritmos',
        disciplina_id: disciplinaTesteId,
        nota: 8.5,
        descricao: 'Prova 1'
      };
      
      const response = await api.post('/notas', novaNota);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.cpf).toBe(cpfAluno);
      expect(response.data.disciplina).toBe('Algoritmos');
      expect(response.data.nota).toBe(8.5);
      
      notaTesteId = response.data.id;
    });

    test('ID deve ser gerado automaticamente', async () => {
      const novaNota = {
        cpf: cpfAluno,
        disciplina: 'Lógica de Programação',
        disciplina_id: disciplinaRedId,
        nota: 7.0
      };
      
      const response = await api.post('/notas', novaNota);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeTruthy();
      expect(response.data).toHaveProperty('id');
    });

    test('Deve aceitar nota com valor inteiro', async () => {
      const novaNota = {
        cpf: cpfAluno,
        disciplina: 'Estruturas de Dados',
        disciplina_id: disciplinaTesteId,
        nota: 10
      };
      
      const response = await api.post('/notas', novaNota);
      
      expect(response.status).toBe(201);
      expect(response.data.nota).toBe(10);
    });

    test('Deve aceitar nota com 2 casas decimais', async () => {
      const novaNota = {
        cpf: cpfAluno,
        disciplina: 'Banco de Dados',
        disciplina_id: disciplinaTesteId,
        nota: 6.75
      };
      
      const response = await api.post('/notas', novaNota);
      
      expect(response.status).toBe(201);
      expect(response.data.nota).toBe(6.75);
    });

    test('Deve aceitar nota zero', async () => {
      const novaNota = {
        cpf: cpfAluno,
        disciplina: 'Desenvolvimento Web',
        disciplina_id: disciplinaRedId,
        nota: 0
      };
      
      const response = await api.post('/notas', novaNota);
      
      expect(response.status).toBe(201);
      expect(response.data.nota).toBe(0);
    });

    test('Deve aceitar descrição opcional', async () => {
      const novaNota = {
        cpf: cpfAluno,
        disciplina: 'Redes de Computadores',
        disciplina_id: disciplinaRedId,
        nota: 9.0,
        descricao: 'Trabalho Final'
      };
      
      const response = await api.post('/notas', novaNota);
      
      expect(response.status).toBe(201);
      expect(response.data.descricao).toBe('Trabalho Final');
    });

    test('Deve rejeitar CPF com menos de 11 dígitos', async () => {
      const notaInvalida = {
        cpf: '123456789',
        disciplina: 'Teste',
        disciplina_id: disciplinaTesteId,
        nota: 8.0
      };
      
      const response = await api.post('/notas', notaInvalida);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar CPF com mais de 11 dígitos', async () => {
      const notaInvalida = {
        cpf: '123456789012',
        disciplina: 'Teste',
        disciplina_id: disciplinaTesteId,
        nota: 8.0
      };
      
      const response = await api.post('/notas', notaInvalida);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar CPF com caracteres não numéricos', async () => {
      const notaInvalida = {
        cpf: '111.111.111-11',
        disciplina: 'Teste',
        disciplina_id: disciplinaTesteId,
        nota: 8.0
      };
      
      const response = await api.post('/notas', notaInvalida);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar nota sem disciplina', async () => {
      const notaInvalida = {
        cpf: cpfAluno,
        disciplina_id: disciplinaTesteId,
        nota: 8.0
      };
      
      const response = await api.post('/notas', notaInvalida);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar nota sem valor numérico', async () => {
      const notaInvalida = {
        cpf: cpfAluno,
        disciplina: 'Teste',
        disciplina_id: disciplinaTesteId
      };
      
      const response = await api.post('/notas', notaInvalida);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar nota menor que 0', async () => {
      const notaInvalida = {
        cpf: cpfAluno,
        disciplina: 'Teste',
        disciplina_id: disciplinaTesteId,
        nota: -1
      };
      
      const response = await api.post('/notas', notaInvalida);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar nota maior que 10', async () => {
      const notaInvalida = {
        cpf: cpfAluno,
        disciplina: 'Teste',
        disciplina_id: disciplinaTesteId,
        nota: 10.5
      };
      
      const response = await api.post('/notas', notaInvalida);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

  });

  // ========================================
  // GET /notas - Listar notas
  // ========================================
  describe('GET /notas', () => {
    
    test('Deve retornar lista de notas', async () => {
      const response = await api.get('/notas');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('Deve retornar notas com estrutura correta', async () => {
      const response = await api.get('/notas');
      
      const nota = response.data[0];
      expect(nota).toHaveProperty('id');
      expect(nota).toHaveProperty('cpf');
      expect(nota).toHaveProperty('disciplina');
      expect(nota).toHaveProperty('disciplina_id');
      expect(nota).toHaveProperty('nota');
    });

    test('Deve filtrar notas por disciplina_id', async () => {
      const response = await api.get(`/notas?disciplina_id=${disciplinaTesteId}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        response.data.forEach(nota => {
          expect(nota.disciplina_id).toBe(disciplinaTesteId);
        });
      }
    });

    test('Notas devem estar ordenadas por data de criação (mais recentes primeiro)', async () => {
      const response = await api.get('/notas');
      
      if (response.data.length > 1) {
        const primeiraData = new Date(response.data[0].created_at);
        const segundaData = new Date(response.data[1].created_at);
        
        expect(primeiraData >= segundaData).toBe(true);
      }
    });

  });

  // ========================================
  // GET /notas/aluno/:cpf - Buscar notas por aluno
  // ========================================
  describe('GET /notas/aluno/:cpf', () => {
    
    test('Deve retornar notas de um aluno específico', async () => {
      const response = await api.get(`/notas/aluno/${cpfAluno}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        response.data.forEach(nota => {
          expect(nota.cpf).toBe(cpfAluno);
        });
      }
    });

    test('Deve retornar array vazio para aluno sem notas', async () => {
      const response = await api.get('/notas/aluno/99999999999');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(0);
    });

    test('Notas do aluno devem estar ordenadas por data', async () => {
      const response = await api.get(`/notas/aluno/${cpfAluno}`);
      
      if (response.data.length > 1) {
        const primeiraData = new Date(response.data[0].created_at);
        const segundaData = new Date(response.data[1].created_at);
        
        expect(primeiraData >= segundaData).toBe(true);
      }
    });

  });

  // ========================================
  // GET /notas/:id - Buscar nota por ID
  // ========================================
  describe('GET /notas/:id', () => {
    
    test('Deve retornar nota por ID válido', async () => {
      const response = await api.get(`/notas/${notaTesteId}`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', notaTesteId);
      expect(response.data).toHaveProperty('cpf');
      expect(response.data).toHaveProperty('disciplina');
      expect(response.data).toHaveProperty('nota');
    });

    test('Deve retornar 404 para ID inexistente', async () => {
      const response = await api.get('/notas/id_inexistente_12345');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toMatch(/não encontrada/i);
    });

  });

  // ========================================
  // Validações de Dados
  // ========================================
  describe('Validações de Dados', () => {
    
    test('CPF deve ter formato válido', async () => {
      const response = await api.get(`/notas/${notaTesteId}`);
      
      expect(response.data.cpf).toMatch(/^\d{11}$/);
    });

    test('Nota deve estar entre 0 e 10', async () => {
      const response = await api.get(`/notas/${notaTesteId}`);
      
      expect(response.data.nota).toBeGreaterThanOrEqual(0);
      expect(response.data.nota).toBeLessThanOrEqual(10);
    });

    test('Disciplina deve ser string não vazia', async () => {
      const response = await api.get(`/notas/${notaTesteId}`);
      
      expect(typeof response.data.disciplina).toBe('string');
      expect(response.data.disciplina.length).toBeGreaterThan(0);
    });

    test('Disciplina_id deve estar presente', async () => {
      const response = await api.get(`/notas/${notaTesteId}`);
      
      expect(response.data).toHaveProperty('disciplina_id');
      expect(typeof response.data.disciplina_id).toBe('number');
      expect(response.data.disciplina_id).toBeGreaterThan(0);
    });

  });

  // ========================================
  // Performance
  // ========================================
  describe('Performance', () => {
    
    test('Listagem de notas deve responder em menos de 2 segundos', async () => {
      const startTime = Date.now();
      await api.get('/notas');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

    test('Busca por ID deve responder em menos de 1 segundo', async () => {
      const startTime = Date.now();
      await api.get(`/notas/${notaTesteId}`);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

    test('Busca por aluno deve responder em menos de 1 segundo', async () => {
      const startTime = Date.now();
      await api.get(`/notas/aluno/${cpfAluno}`);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

  });

  // ========================================
  // Integração
  // ========================================
  describe('Integração', () => {
    
    test('CPF da nota deve corresponder a um aluno existente', async () => {
      const notaResponse = await api.get(`/notas/${notaTesteId}`);
      const cpf = notaResponse.data.cpf;
      
      const alunoResponse = await api.get(`/alunos/${cpf}`);
      
      expect(alunoResponse.status).toBe(200);
      expect(alunoResponse.data.cpf).toBe(cpf);
    });

    test('Disciplina_id da nota deve existir na tabela de disciplinas', async () => {
      const notaResponse = await api.get(`/notas/${notaTesteId}`);
      const disciplinaId = notaResponse.data.disciplina_id;
      
      const disciplinaResponse = await api.get(`/disciplinas/${disciplinaId}`);
      
      expect(disciplinaResponse.status).toBe(200);
      expect(disciplinaResponse.data.id).toBe(disciplinaId);
    });

    test('Aluno pode ter múltiplas notas', async () => {
      const response = await api.get(`/notas/aluno/${cpfAluno}`);
      
      expect(response.status).toBe(200);
      expect(response.data.length).toBeGreaterThan(0);
    });

  });

});
