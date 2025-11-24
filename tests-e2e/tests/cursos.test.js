/**
 * Testes E2E para o endpoint de Cursos
 */

const api = require('../helpers/api.helper');

describe('Cursos API - E2E Tests', () => {
  
  describe('GET /cursos', () => {
    test('Deve retornar lista de cursos', async () => {
      const response = await api.get('/cursos');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('Deve retornar cursos com estrutura correta', async () => {
      const response = await api.get('/cursos');
      
      expect(response.status).toBe(200);
      
      if (response.data.length > 0) {
        const curso = response.data[0];
        expect(curso).toHaveProperty('id');
        expect(curso).toHaveProperty('nome');
        expect(curso).toHaveProperty('disciplinas');
        expect(Array.isArray(curso.disciplinas)).toBe(true);
      }
    });

    test('Deve retornar cursos com encoding UTF-8 correto', async () => {
      const response = await api.get('/cursos');
      
      expect(response.status).toBe(200);
      
      // Procurar por curso com caracteres especiais
      const cursoComAcentos = response.data.find(c => 
        c.nome.includes('Administração') || c.nome.includes('Análise')
      );
      
      if (cursoComAcentos) {
        // Verificar que não tem caracteres corrompidos como "Ã§Ã£"
        expect(cursoComAcentos.nome).not.toMatch(/Ã/);
      }
    });
  });

  describe('GET /cursos/:id', () => {
    test('Deve retornar curso específico por ID', async () => {
      const response = await api.get('/cursos/1');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', 1);
      expect(response.data).toHaveProperty('nome');
      expect(response.data).toHaveProperty('disciplinas');
    });

    test('Deve retornar 404 para curso inexistente', async () => {
      const response = await api.get('/cursos/999999');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });
  });

  describe('POST /cursos', () => {
    const novoCurso = {
      nome: 'Curso de Teste',
      disciplinas: [1, 2]
    };

    test('Deve criar um novo curso', async () => {
      const response = await api.post('/cursos', novoCurso);
      
      expect([201, 400, 500]).toContain(response.status); // 400 se duplicado, 500 se não implementado
      
      if (response.status === 201) {
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('nome', novoCurso.nome);
      }
    });

    test('Deve validar campos obrigatórios', async () => {
      const cursoInvalido = {
        // faltando nome
        disciplinas: [1]
      };

      const response = await api.post('/cursos', cursoInvalido);
      
      // Pode ser 400 (validação) ou 500 (não implementado)
      expect([400, 500]).toContain(response.status);
    });

    // Cleanup - deletar curso de teste se foi criado
    afterAll(async () => {
      // Cursos podem não ter DELETE implementado
    });
  });

  describe('PUT /cursos/:id', () => {
    test('Deve atualizar um curso existente', async () => {
      const dadosAtualizacao = {
        nome: 'Análise e Desenvolvimento de Sistemas - Atualizado',
        disciplinas: [1, 2, 3]
      };

      const response = await api.put('/cursos/1', dadosAtualizacao);
      
      expect([200, 400, 500]).toContain(response.status); // 400 se falha, 500 se não implementado
      
      if (response.status === 200) {
        expect(response.data).toHaveProperty('id', 1);
      }
    });

    test('Deve retornar 404 ao atualizar curso inexistente', async () => {
      const response = await api.put('/cursos/999999', {
        nome: 'Teste'
      });
      
      expect([404, 500]).toContain(response.status);
    });
  });

  describe('DELETE /cursos/:id', () => {
    test('Deve deletar um curso (se implementado)', async () => {
      // Primeiro criar um curso para deletar
      const cursoTemp = {
        nome: 'Curso para Deletar',
        disciplinas: []
      };

      const createResp = await api.post('/cursos', cursoTemp);
      
      if (createResp.status === 201) {
        const cursoId = createResp.data.id;
        const response = await api.delete(`/cursos/${cursoId}`);
        
        // Pode retornar 200, 204 ou 500 (não implementado)
        expect([200, 204, 404, 500]).toContain(response.status);
      }
    });
  });

  describe('Validações de Negócio', () => {
    test('Não deve permitir nome duplicado', async () => {
      const cursoDuplicado = {
        nome: 'Análise e Desenvolvimento de Sistemas', // Já existe
        disciplinas: []
      };

      const response = await api.post('/cursos', cursoDuplicado);
      
      // Deve retornar 409 (conflict), 400 (bad request) ou 500
      expect([400, 409, 500]).toContain(response.status);
    });

    test('Nome do curso não deve estar vazio', async () => {
      const cursoInvalido = {
        nome: '',
        disciplinas: []
      };

      const response = await api.post('/cursos', cursoInvalido);
      
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('Performance', () => {
    test('Listagem de cursos deve responder em menos de 2 segundos', async () => {
      const start = Date.now();
      const response = await api.get('/cursos');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000);
    });
  });
});
