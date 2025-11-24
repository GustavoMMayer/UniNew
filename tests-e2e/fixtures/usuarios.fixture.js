/**
 * Fixtures de Usuários
 * Dados de teste para usuários
 */

const usuariosFixture = {
  aluno: {
    cpf: '55555555555',
    nome: 'Usuário Teste Aluno',
    email: 'aluno.teste@uninew.com',
    telefone: '11987654321',
    senha: 'senha123',
    tipo_conta: 'aluno',
    curso: 'Engenharia',
    situacao: 'Ativo',
  },
  docente: {
    cpf: '66666666666',
    nome: 'Professor Teste',
    email: 'professor.teste@uninew.com',
    telefone: '11987654322',
    senha: 'senha123',
    tipo_conta: 'docente',
    grau_academico: 'Mestrado',
    disciplina: 'Matemática',
    carga_horaria: 40,
  },
  funcionario: {
    cpf: '77777777777',
    nome: 'Funcionário Teste',
    email: 'funcionario.teste@uninew.com',
    telefone: '11987654323',
    senha: 'senha123',
    tipo_conta: 'funcionario',
  },
  gerente: {
    cpf: '88888888888',
    nome: 'Gerente Teste',
    email: 'gerente.teste@uninew.com',
    telefone: '11987654324',
    senha: 'senha123',
    tipo_conta: 'gerente',
  },
};

const cpfsParaLimpar = [
  '55555555555',
  '66666666666',
  '77777777777',
  '88888888888',
  '99999999999',
  '10101010101',
  '20202020202',
  '30303030303',
];

module.exports = {
  usuariosFixture,
  cpfsParaLimpar,
};
