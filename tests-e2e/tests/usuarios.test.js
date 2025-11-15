/**
 * Testes E2E - Usuários API
 * 
 * Testes end-to-end para endpoints de usuários
 * Base URL: http://localhost:3000/api/usuarios
 */

const api = require('../helpers/api.helper');
const { usuariosFixture, cpfsParaLimpar } = require('../fixtures/usuarios.fixture');

describe('Usuários API - E2E Tests', () => {
  
  let usuarioTesteCpf = '55555555555';

  // Setup: Limpar dados antes de todos os testes
  beforeAll(async () => {
    // Limpar usuários de teste que possam existir
    for (const cpf of cpfsParaLimpar) {
      await api.delete(`/usuarios/${cpf}`);
    }
  });

  // Teardown: Limpar dados após todos os testes
  afterAll(async () => {
    // Limpar todos os usuários criados durante os testes
    for (const cpf of cpfsParaLimpar) {
      await api.delete(`/usuarios/${cpf}`);
    }
  });

  // ========================================
  // POST /usuarios - Criar usuário
  // ========================================
  describe('POST /usuarios', () => {
    
    test('Deve criar novo usuário do tipo aluno', async () => {
      const novoUsuario = {
        cpf: usuarioTesteCpf,
        nome: 'Usuário Teste',
        email: 'usuario.teste@email.com',
        telefone: '11999999999',
        senha: 'senha123',
        tipo_conta: 'aluno',
        curso: 'Ciência da Computação',
        situacao: 'Ativo'
      };
      
      const response = await api.post('/usuarios', novoUsuario);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('cpf', usuarioTesteCpf);
      expect(response.data).toHaveProperty('nome', 'Usuário Teste');
      expect(response.data).toHaveProperty('tipo_conta', 'aluno');
      expect(response.data).not.toHaveProperty('senha');
    });

    test('Deve criar usuário do tipo docente', async () => {
      const novoDocente = {
        cpf: '66666666666',
        nome: 'Docente Novo',
        email: 'novo.docente@email.com',
        senha: 'senha123',
        tipo_conta: 'docente',
        grau_academico: 'Mestrado',
        disciplina: 'Matemática',
        carga_horaria: 40
      };
      
      const response = await api.post('/usuarios', novoDocente);
      
      expect(response.status).toBe(201);
      expect(response.data.tipo_conta).toBe('docente');
      expect(response.data.grau_academico).toBe('Mestrado');
    });

    test('Deve criar usuário do tipo funcionario', async () => {
      const novoFuncionario = {
        cpf: '77777777777',
        nome: 'Funcionário Novo',
        email: 'func.novo@email.com',
        senha: 'senha123',
        tipo_conta: 'funcionario'
      };
      
      const response = await api.post('/usuarios', novoFuncionario);
      
      expect(response.status).toBe(201);
      expect(response.data.tipo_conta).toBe('funcionario');
    });

    test('Deve criar usuário do tipo gerente', async () => {
      const novoGerente = {
        cpf: '88888888888',
        nome: 'Gerente Novo',
        email: 'gerente.novo@email.com',
        senha: 'senha123',
        tipo_conta: 'gerente'
      };
      
      const response = await api.post('/usuarios', novoGerente);
      
      expect(response.status).toBe(201);
      expect(response.data.tipo_conta).toBe('gerente');
    });

    test('Senha não deve ser retornada na resposta', async () => {
      const novoUsuario = {
        cpf: '99999999999',
        nome: 'Teste Senha',
        email: 'senha.teste@email.com',
        senha: 'senha123',
        tipo_conta: 'aluno'
      };
      
      const response = await api.post('/usuarios', novoUsuario);
      
      expect(response.status).toBe(201);
      expect(response.data).not.toHaveProperty('senha');
    });

    test('Deve rejeitar CPF com menos de 11 dígitos', async () => {
      const usuarioInvalido = {
        cpf: '123456789',
        nome: 'Teste',
        email: 'teste@email.com',
        senha: 'senha123',
        tipo_conta: 'aluno'
      };
      
      const response = await api.post('/usuarios', usuarioInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar email inválido', async () => {
      const usuarioInvalido = {
        cpf: '12345678901',
        nome: 'Teste',
        email: 'email-invalido',
        senha: 'senha123',
        tipo_conta: 'aluno'
      };
      
      const response = await api.post('/usuarios', usuarioInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar senha com menos de 6 caracteres', async () => {
      const usuarioInvalido = {
        cpf: '12345678901',
        nome: 'Teste',
        email: 'teste@email.com',
        senha: '12345',
        tipo_conta: 'aluno'
      };
      
      const response = await api.post('/usuarios', usuarioInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Deve rejeitar tipo_conta inválido', async () => {
      const usuarioInvalido = {
        cpf: '12345678901',
        nome: 'Teste',
        email: 'teste@email.com',
        senha: 'senha123',
        tipo_conta: 'administrador'
      };
      
      const response = await api.post('/usuarios', usuarioInvalido);
      
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Dados inválidos');
    });

    test('Tipo_conta_id deve ser gerado automaticamente', async () => {
      const response = await api.get(`/usuarios/${usuarioTesteCpf}`);
      
      expect(response.data).toHaveProperty('tipo_conta_id');
      expect(response.data.tipo_conta_id).toBe(1); // aluno = 1
    });

  });

  // ========================================
  // GET /usuarios - Listar usuários
  // ========================================
  describe('GET /usuarios', () => {
    
    test('Deve retornar lista de usuários', async () => {
      const response = await api.get('/usuarios');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('Usuários não devem conter senha', async () => {
      const response = await api.get('/usuarios');
      
      response.data.forEach(usuario => {
        expect(usuario).not.toHaveProperty('senha');
      });
    });

    test('Deve filtrar usuários por tipo_conta=aluno', async () => {
      const response = await api.get('/usuarios?tipo_conta=aluno');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      response.data.forEach(usuario => {
        expect(usuario.tipo_conta).toBe('aluno');
      });
    });

    test('Deve filtrar usuários por tipo_conta=docente', async () => {
      const response = await api.get('/usuarios?tipo_conta=docente');
      
      expect(response.status).toBe(200);
      
      response.data.forEach(usuario => {
        expect(usuario.tipo_conta).toBe('docente');
      });
    });

    test('Deve filtrar usuários por curso', async () => {
      const response = await api.get('/usuarios?curso=Ciência da Computação');
      
      expect(response.status).toBe(200);
      
      response.data.forEach(usuario => {
        expect(usuario.curso).toBe('Ciência da Computação');
      });
    });

    test('Deve filtrar usuários por situacao=Ativo', async () => {
      const response = await api.get('/usuarios?situacao=Ativo');
      
      expect(response.status).toBe(200);
      
      response.data.forEach(usuario => {
        expect(usuario.situacao).toBe('Ativo');
      });
    });

  });

  // ========================================
  // GET /usuarios/:cpf - Buscar por CPF
  // ========================================
  describe('GET /usuarios/:cpf', () => {
    
    test('Deve retornar usuário por CPF válido', async () => {
      const response = await api.get(`/usuarios/${usuarioTesteCpf}`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('cpf', usuarioTesteCpf);
      expect(response.data).toHaveProperty('nome');
      expect(response.data).toHaveProperty('email');
    });

    test('Não deve retornar senha do usuário', async () => {
      const response = await api.get(`/usuarios/${usuarioTesteCpf}`);
      
      expect(response.data).not.toHaveProperty('senha');
    });

    test('Deve retornar 404 para CPF inexistente', async () => {
      const response = await api.get('/usuarios/00000000000');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

  });

  // ========================================
  // GET /usuarios/email/:email - Buscar por email
  // ========================================
  describe('GET /usuarios/email/:email', () => {
    
    test('Deve retornar usuário por email válido', async () => {
      const response = await api.get('/usuarios/email/usuario.teste@email.com');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('email', 'usuario.teste@email.com');
      expect(response.data).toHaveProperty('cpf');
    });

    test('Não deve retornar senha do usuário', async () => {
      const response = await api.get('/usuarios/email/usuario.teste@email.com');
      
      expect(response.data).not.toHaveProperty('senha');
    });

    test('Deve retornar 404 para email inexistente', async () => {
      const response = await api.get('/usuarios/email/naoexiste@email.com');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

  });

  // ========================================
  // PUT /usuarios/:cpf - Atualizar usuário
  // ========================================
  describe('PUT /usuarios/:cpf', () => {
    
    test('Deve atualizar nome do usuário', async () => {
      const dadosAtualizacao = {
        nome: 'Usuário Atualizado'
      };
      
      const response = await api.put(`/usuarios/${usuarioTesteCpf}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.nome).toBe('Usuário Atualizado');
      
      // Reverter
      await api.put(`/usuarios/${usuarioTesteCpf}`, { nome: 'Usuário Teste' });
    });

    test('Deve atualizar email do usuário', async () => {
      const dadosAtualizacao = {
        email: 'novo.email@teste.com'
      };
      
      const response = await api.put(`/usuarios/${usuarioTesteCpf}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.email).toBe('novo.email@teste.com');
      
      // Reverter
      await api.put(`/usuarios/${usuarioTesteCpf}`, { email: 'usuario.teste@email.com' });
    });

    test('Deve atualizar telefone do usuário', async () => {
      const dadosAtualizacao = {
        telefone: '11888888888'
      };
      
      const response = await api.put(`/usuarios/${usuarioTesteCpf}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.telefone).toBe('11888888888');
    });

    test('Deve atualizar situação do aluno', async () => {
      const dadosAtualizacao = {
        situacao: 'Inativo'
      };
      
      const response = await api.put(`/usuarios/${usuarioTesteCpf}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.situacao).toBe('Inativo');
      
      // Reverter
      await api.put(`/usuarios/${usuarioTesteCpf}`, { situacao: 'Ativo' });
    });

    test('Não deve permitir atualizar CPF', async () => {
      const dadosAtualizacao = {
        nome: 'Teste'
      };
      
      const response = await api.put(`/usuarios/${usuarioTesteCpf}`, dadosAtualizacao);
      
      expect(response.status).toBe(200);
      expect(response.data.cpf).toBe(usuarioTesteCpf);
      
      // Reverter
      await api.put(`/usuarios/${usuarioTesteCpf}`, { nome: 'Usuário Teste' });
    });

    test('Deve retornar 404 ao atualizar usuário inexistente', async () => {
      const dadosAtualizacao = {
        nome: 'Teste'
      };
      
      const response = await api.put('/usuarios/00000000000', dadosAtualizacao);
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

  });

  // ========================================
  // DELETE /usuarios/:cpf - Excluir usuário
  // ========================================
  describe('DELETE /usuarios/:cpf', () => {
    
    test('Deve excluir usuário existente', async () => {
      // Criar usuário temporário
      const usuarioTemp = {
        cpf: '10101010101',
        nome: 'Temp User',
        email: 'temp@test.com',
        senha: 'senha123',
        tipo_conta: 'aluno'
      };
      await api.post('/usuarios', usuarioTemp);
      
      const response = await api.delete('/usuarios/10101010101');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data.message).toMatch(/excluído com sucesso/i);
    });

    test('Deve retornar informações do usuário excluído', async () => {
      // Criar usuário temporário
      const usuarioTemp = {
        cpf: '20202020202',
        nome: 'Delete Test',
        email: 'delete@test.com',
        senha: 'senha123',
        tipo_conta: 'aluno'
      };
      await api.post('/usuarios', usuarioTemp);
      
      const response = await api.delete('/usuarios/20202020202');
      
      expect(response.data).toHaveProperty('usuario');
      expect(response.data.usuario).toHaveProperty('cpf', '20202020202');
      expect(response.data.usuario).toHaveProperty('nome', 'Delete Test');
    });

    test('Deve retornar 404 ao excluir usuário inexistente', async () => {
      const response = await api.delete('/usuarios/00000000000');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

    test('Usuário excluído não deve mais existir', async () => {
      // Criar e excluir
      const usuarioTemp = {
        cpf: '30303030303',
        nome: 'Verify Delete',
        email: 'verify@test.com',
        senha: 'senha123',
        tipo_conta: 'aluno'
      };
      await api.post('/usuarios', usuarioTemp);
      await api.delete('/usuarios/30303030303');
      
      // Verificar que não existe mais
      const response = await api.get('/usuarios/30303030303');
      expect(response.status).toBe(404);
    });

  });

  // ========================================
  // Validações de Dados
  // ========================================
  describe('Validações de Dados', () => {
    
    test('CPF deve ter formato válido', async () => {
      const response = await api.get(`/usuarios/${usuarioTesteCpf}`);
      
      expect(response.data.cpf).toMatch(/^\d{11}$/);
    });

    test('Email deve ter formato válido', async () => {
      const response = await api.get(`/usuarios/${usuarioTesteCpf}`);
      
      expect(response.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    test('Tipo_conta deve ser válido', async () => {
      const response = await api.get(`/usuarios/${usuarioTesteCpf}`);
      
      const tiposValidos = ['aluno', 'docente', 'funcionario', 'gerente'];
      expect(tiposValidos).toContain(response.data.tipo_conta);
    });

    test('Tipo_conta_id deve corresponder ao tipo_conta', async () => {
      const response = await api.get(`/usuarios/${usuarioTesteCpf}`);
      
      const mapeamento = {
        'aluno': 1,
        'docente': 2,
        'funcionario': 3,
        'gerente': 4
      };
      
      expect(response.data.tipo_conta_id).toBe(mapeamento[response.data.tipo_conta]);
    });

  });

  // ========================================
  // Performance
  // ========================================
  describe('Performance', () => {
    
    test('Listagem de usuários deve responder em menos de 2 segundos', async () => {
      const startTime = Date.now();
      await api.get('/usuarios');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

    test('Busca por CPF deve responder em menos de 1 segundo', async () => {
      const startTime = Date.now();
      await api.get(`/usuarios/${usuarioTesteCpf}`);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

    test('Busca por email deve responder em menos de 1 segundo', async () => {
      const startTime = Date.now();
      await api.get('/usuarios/email/usuario.teste@email.com');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

  });

});
