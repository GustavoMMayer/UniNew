/**
 * Fixtures de Fornecedores
 * Dados de teste para fornecedores
 */

const fornecedoresFixture = {
  principal: {
    cnpj: '12345678000199',
    razao_social: 'Fornecedor Teste Principal LTDA',
    contatos: ['contato1@fornecedor.com', '11987654321'],
    servicos: ['Serviço A', 'Serviço B'],
    categoria: 'Tecnologia',
    ativo: true,
  },
  secundario: {
    cnpj: '98765432000188',
    razao_social: 'Fornecedor Teste Secundário LTDA',
    contatos: ['contato2@fornecedor.com'],
    servicos: ['Serviço C'],
    categoria: 'Consultoria',
    ativo: true,
  },
};

const cnpjsParaLimpar = [
  '12345678000199',
  '98765432000188',
  '11111111111111',
  '22222222222222',
  '33333333333333',
];

module.exports = {
  fornecedoresFixture,
  cnpjsParaLimpar,
};
