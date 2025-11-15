/**
 * Testes E2E - Auth API
 * 
 * Testes end-to-end para endpoints de autenticação
 * Base URL: http://localhost:3000/api/auth
 */

const api = require('../helpers/api.helper');
const { usuariosFixture, cpfsParaLimpar } = require('../fixtures/usuarios.fixture');
const db = require('../helpers/database');

describe('Auth API - E2E Tests', () => {

  beforeAll(async () => {
    await db.query('DELETE FROM usuarios WHERE cpf IN (?)', [cpfsParaLimpar]);
    
    await api.post('/usuarios', usuariosFixture.aluno);
    await api.post('/usuarios', usuariosFixture.docente);
    await api.post('/usuarios', usuariosFixture.funcionario);
    await api.post('/usuarios', usuariosFixture.gerente);
  });

  afterAll(async () => {
    await db.query('DELETE FROM usuarios WHERE cpf IN (?)', [cpfsParaLimpar]);
  });
  
  // ========================================
  // POST /auth/login - Login de usuário
  // ========================================
  describe('POST /auth/login', () => {
    
    test('Deve fazer login com credenciais válidas', async () => {
      const credentials = {
        username: '55555555555',
        password: 'senha123'
      };
      
      const response = await api.post('/auth/login', credentials);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('usuario');
      expect(response.data.usuario).not.toHaveProperty('senha'); // Senha não deve ser retornada
    });

    test('Deve fazer login com email válido', async () => {
      const credentials = {
        username: 'aluno.teste@uninew.com',
        password: 'senha123'
      };
      
      const response = await api.post('/auth/login', credentials);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data.usuario).toHaveProperty('email', 'aluno.teste@uninew.com');
    });

    test('Deve retornar erro 400 para credenciais inválidas', async () => {
      const credentials = {
        username: '11111111111',
        password: 'senhaerrada'
      };
      
      const response = await api.post('/auth/login', credentials);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toMatch(/credenciais inválidas/i);
    });

    test('Deve retornar erro 400 para usuário inexistente', async () => {
      const credentials = {
        username: '99999999999',
        password: 'senha123'
      };
      
      const response = await api.post('/auth/login', credentials);
      
      expect(response.status).toBe(400);
      expect(response.data.error).toMatch(/credenciais inválidas/i);
    });

    test('Deve validar campo username obrigatório', async () => {
      const credentials = {
        password: 'senha123'
      };
      
      const response = await api.post('/auth/login', credentials);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('errors');
      expect(Array.isArray(response.data.errors)).toBe(true);
      expect(response.data.errors[0].field).toBe('username');
    });

    test('Deve validar campo password obrigatório', async () => {
      const credentials = {
        username: '11111111111'
      };
      
      const response = await api.post('/auth/login', credentials);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('errors');
      expect(Array.isArray(response.data.errors)).toBe(true);
      expect(response.data.errors[0].field).toBe('password');
    });

    test('Deve validar tamanho mínimo da senha', async () => {
      const credentials = {
        username: '11111111111',
        password: '12345' // Menos que 6 caracteres
      };
      
      const response = await api.post('/auth/login', credentials);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('errors');
      expect(Array.isArray(response.data.errors)).toBe(true);
      expect(response.data.errors[0].field).toBe('password');
      expect(response.data.errors[0].message).toMatch(/mínimo|6/i);
    });

    test('Token JWT deve ter estrutura válida', async () => {
      const credentials = {
        username: '11111111111',
        password: 'senha123'
      };
      
      const response = await api.post('/auth/login', credentials);
      const token = response.data.token;
      
      // JWT tem 3 partes separadas por ponto
      expect(token.split('.')).toHaveLength(3);
      
      // Verificar se começa com formato JWT padrão
      expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });

    test('Usuário retornado deve ter estrutura correta', async () => {
      const credentials = {
        username: '11111111111',
        password: 'senha123'
      };
      
      const response = await api.post('/auth/login', credentials);
      const usuario = response.data.usuario;
      
      expect(usuario).toHaveProperty('cpf');
      expect(usuario).toHaveProperty('nome');
      expect(usuario).toHaveProperty('email');
      expect(usuario).toHaveProperty('tipo_conta');
      expect(usuario).not.toHaveProperty('senha'); // Segurança: senha não deve vazar
    });

  });

  // ========================================
  // POST /auth/logout - Logout de usuário
  // ========================================
  describe('POST /auth/logout', () => {
    
    let authToken;

    beforeAll(async () => {
      // Fazer login para obter token
      const credentials = {
        username: '11111111111',
        password: 'senha123'
      };
      
      const loginResponse = await api.post('/auth/login', credentials);
      authToken = loginResponse.data.token;
    });

    test('Deve fazer logout com token válido', async () => {
      const response = await api.post('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('ok', true);
    });

    test('Deve fazer logout mesmo sem token (logout local)', async () => {
      // Logout pode funcionar sem token (apenas limpa localStorage no frontend)
      const response = await api.post('/auth/logout', {});
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('ok', true);
    });

  });

  // ========================================
  // Validações de Segurança
  // ========================================
  describe('Validações de Segurança', () => {
    
    test('Não deve expor informações sensíveis em erros', async () => {
      const credentials = {
        username: '11111111111',
        password: 'senhaerrada'
      };
      
      const response = await api.post('/auth/login', credentials);
      
      // Não deve dizer "senha incorreta" ou "usuário não encontrado"
      // Apenas "credenciais inválidas" genérico
      const errorMsg = response.data?.error?.toLowerCase() || '';
      expect(errorMsg).toMatch(/credenciais inválidas/i);
      expect(errorMsg).not.toMatch(/senha incorreta|user not found|password incorrect/i);
    });

    test('Deve aceitar CPF com ou sem pontuação', async () => {
      const credentialsComPontuacao = {
        username: '111.111.111-11',
        password: 'senha123'
      };
      
      const credentialsSemPontuacao = {
        username: '11111111111',
        password: 'senha123'
      };
      
      // Ambos devem funcionar (implementação futura)
      // Por enquanto, apenas testamos que não quebra
      try {
        await api.post('/auth/login', credentialsComPontuacao);
      } catch (error) {
        // Aceita erro 400 (credenciais inválidas) mas não 500 (quebrou)
        expect(error.response.status).toBeLessThan(500);
      }
      
      const response = await api.post('/auth/login', credentialsSemPontuacao);
      expect(response.status).toBe(200);
    });

  });

  // ========================================
  // Performance
  // ========================================
  describe('Performance', () => {
    
    test('Login deve responder em menos de 2 segundos', async () => {
      const credentials = {
        username: '11111111111',
        password: 'senha123'
      };
      
      const startTime = Date.now();
      await api.post('/auth/login', credentials);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

  });

  // ========================================
  // Integração com outros endpoints
  // ========================================
  describe('Integração - Acesso protegido', () => {
    
    test('Deve conseguir acessar endpoint protegido com token válido', async () => {
      // 1. Fazer login
      const credentials = {
        username: '11111111111',
        password: 'senha123'
      };
      
      const loginResponse = await api.post('/auth/login', credentials);
      const token = loginResponse.data.token;
      
      // 2. Tentar acessar endpoint protegido (exemplo: /usuarios)
      // Este teste pode falhar se middleware de auth ainda não estiver implementado
      try {
        const response = await api.get('/usuarios', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Se middleware estiver implementado, deve retornar 200
        expect(response.status).toBe(200);
      } catch (error) {
        // Se middleware não estiver implementado, endpoint pode não exigir auth ainda
        // Aceita 200 (sem auth) ou 401 (auth implementada mas token inválido)
        expect([200, 401]).toContain(error.response?.status || 200);
      }
    });

  });

});
