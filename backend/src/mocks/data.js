const bcrypt = require('bcrypt');

const senhaHash = bcrypt.hashSync('senha123', 10);

const mockData = {
  auth: {
    loginResponse: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIxMTExMTExMTExMSIsInRpcG9fY29udGEiOiJhbHVubyIsImlhdCI6MTYzMTI4MDAwMCwiZXhwIjoxNjMxMzY2NDAwfQ.mock_signature",
      usuario: {
        cpf: "11111111111",
        nome: "Aluno Teste",
        email: "aluno@teste.com",
        telefone: "0000-0001",
        tipo_conta: "aluno",
        tipo_conta_id: 1
      }
    },
    logoutResponse: {
      ok: true
    }
  },

  usuarios: [
    {
      cpf: '11111111111',
      nome: 'Aluno Teste',
      email: 'aluno@teste.com',
      telefone: '0000-0001',
      senha: senhaHash,
      tipo_conta: 'aluno',
      tipo_conta_id: 1,
      curso: 'ADS',
      situacao: 'Ativo'
    },
    {
      cpf: '22222222222',
      nome: 'Docente Teste',
      email: 'docente@teste.com',
      telefone: '0000-0002',
      senha: senhaHash,
      tipo_conta: 'docente',
      tipo_conta_id: 2,
      grau_academico: 'Mestrado',
      disciplina: 'Algoritmos',
      carga_horaria: 40
    },
    {
      cpf: '33333333333',
      nome: 'Funcionario Teste',
      email: 'func@teste.com',
      telefone: '0000-0003',
      senha: senhaHash,
      tipo_conta: 'funcionario',
      tipo_conta_id: 3
    },
    {
      cpf: '44444444444',
      nome: 'Gerente Teste',
      email: 'gerente@teste.com',
      telefone: '0000-0004',
      senha: senhaHash,
      tipo_conta: 'gerente',
      tipo_conta_id: 4
    }
  ],

  alunos: [
    {
      cpf: "11111111111",
      nome: "Aluno Teste",
      email: "aluno@teste.com",
      telefone: "0000-0001",
      curso: "ADS",
      situacao: "Ativo"
    }
  ],

  docentes: [
    {
      cpf: "22222222222",
      nome: "Docente Teste",
      grau_academico: "Mestrado",
      disciplina: "Algoritmos",
      carga_horaria: 40
    }
  ],

  fornecedores: [
    {
      cnpj: "12345678000199",
      razao_social: "Fornecedor Teste LTDA",
      contatos: ["contato@fornecedor.com"],
      servicos: ["Reciclagem", "Limpeza"]
    }
  ],

  cursos: [
    {
      codigo: 'ADS',
      nome: 'Análise e Desenvolvimento de Sistemas',
      disciplinas: ['ALG', 'LP']
    },
    {
      codigo: 'MKT',
      nome: 'Marketing',
      disciplinas: ['MKT_DIGITAL', 'ESTRATEGIA']
    },
    {
      codigo: 'ADM',
      nome: 'Administração',
      disciplinas: []
    }
  ],

  disciplinas: [
    {
      codigo: 'ALG',
      nome: 'Algoritmos',
      carga_horaria: 60
    },
    {
      codigo: 'LP',
      nome: 'Linguagem de Programação',
      carga_horaria: 60
    }
  ],

  notas: [
    {
      id: "11111111111_ALG",
      cpf: "11111111111",
      disciplina: "Algoritmos",
      disciplina_codigo: "ALG",
      nota: 8.5,
      criadoEm: "2025-11-10T12:00:00.000Z"
    },
    {
      id: "11111111111_LP",
      cpf: "11111111111",
      disciplina: "Linguagem de Programação",
      disciplina_codigo: "LP",
      nota: 9.0,
      criadoEm: "2025-11-10T12:00:00.000Z"
    }
  ]
};

module.exports = mockData;
