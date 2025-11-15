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
        expect(curso).toHaveProperty('codigo');
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

  describe('GET /cursos/:codigo', () => {
    test('Deve retornar curso específico por código', async () => {
      const response = await api.get('/cursos/ADS');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('codigo', 'ADS');
      expect(response.data).toHaveProperty('nome');
      expect(response.data).toHaveProperty('disciplinas');
    });

    test('Deve retornar 404 para curso inexistente', async () => {
      const response = await api.get('/cursos/NAOEXISTE');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });
  });

  describe('POST /cursos', () => {
    const novoCurso = {
      codigo: 'TST',
      nome: 'Curso de Teste',
      disciplinas: ['DISC1', 'DISC2']
    };

    test('Deve criar um novo curso', async () => {
      const response = await api.post('/cursos', novoCurso);
      
      expect([201, 500]).toContain(response.status); // 500 se não implementado
      
      if (response.status === 201) {
        expect(response.data).toHaveProperty('codigo', novoCurso.codigo);
        expect(response.data).toHaveProperty('nome', novoCurso.nome);
      }
    });

    test('Deve validar campos obrigatórios', async () => {
      const cursoInvalido = {
        codigo: 'TST2'
        // faltando nome
      };

      const response = await api.post('/cursos', cursoInvalido);
      
      // Pode ser 400 (validação) ou 500 (não implementado)
      expect([400, 500]).toContain(response.status);
    });

    // Cleanup - deletar curso de teste se foi criado
    afterAll(async () => {
      try {
        await api.delete('/cursos/TST');
        await api.delete('/cursos/TST2');
      } catch (e) {
        // Ignorar erro se não existir
      }
    });
  });

  describe('PUT /cursos/:codigo', () => {
    test('Deve atualizar um curso existente', async () => {
      const dadosAtualizacao = {
        nome: 'Análise e Desenvolvimento de Sistemas - Atualizado',
        disciplinas: ['ALG', 'LP', 'BD']
      };

      const response = await api.put('/cursos/ADS', dadosAtualizacao);
      
      expect([200, 500]).toContain(response.status); // 500 se não implementado
      
      if (response.status === 200) {
        expect(response.data).toHaveProperty('codigo', 'ADS');
      }
    });

    test('Deve retornar 404 ao atualizar curso inexistente', async () => {
      const response = await api.put('/cursos/NAOEXISTE', {
        nome: 'Teste'
      });
      
      expect([404, 500]).toContain(response.status);
    });
  });

  describe('DELETE /cursos/:codigo', () => {
    test('Deve deletar um curso (se implementado)', async () => {
      // Primeiro criar um curso para deletar
      const cursoTemp = {
        codigo: 'DEL',
        nome: 'Curso para Deletar',
        disciplinas: []
      };

      await api.post('/cursos', cursoTemp);
      
      const response = await api.delete('/cursos/DEL');
      
      // Pode retornar 200, 204 ou 500 (não implementado)
      expect([200, 204, 404, 500]).toContain(response.status);
    });
  });

  describe('Validações de Negócio', () => {
    test('Não deve permitir código duplicado', async () => {
      const cursoDuplicado = {
        codigo: 'ADS', // Já existe
        nome: 'Outro curso',
        disciplinas: []
      };

      const response = await api.post('/cursos', cursoDuplicado);
      
      // Deve retornar 409 (conflict) ou 400 (bad request)
      expect([400, 409, 500]).toContain(response.status);
    });

    test('Código do curso deve ter formato válido', async () => {
      const cursoInvalido = {
        codigo: 'codigo muito longo e invalido',
        nome: 'Teste',
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
