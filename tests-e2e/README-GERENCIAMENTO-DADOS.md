# 🧪 Guia de Testes E2E - Gerenciamento de Dados

## 📋 Visão Geral

Os testes E2E agora possuem uma camada de gerenciamento de dados que garante:
- ✅ Cada módulo pode ser executado independentemente
- ✅ Dados são limpos antes e depois dos testes
- ✅ Não há conflito entre testes executados em paralelo ou sequencialmente

## 🗂️ Estrutura de Arquivos

```
tests-e2e/
├── fixtures/           # Dados de teste padronizados
│   ├── usuarios.fixture.js
│   ├── fornecedores.fixture.js
│   └── disciplinas.fixture.js
├── helpers/            # Funções auxiliares
│   ├── api.helper.js
│   └── database.js
├── scripts/            # Scripts utilitários
│   └── cleanup-database.js
└── tests/              # Testes E2E
    ├── auth.test.js
    ├── alunos.test.js
    ├── disciplinas.test.js
    ├── docentes.test.js
    ├── fornecedores.test.js
    ├── notas.test.js
    └── usuarios.test.js
```

## 🔧 Fixtures

### Usuários (`fixtures/usuarios.fixture.js`)
Define dados padrão para testes de usuários:
- **Aluno**: CPF 55555555555
- **Docente**: CPF 66666666666
- **Funcionário**: CPF 77777777777
- **Gerente**: CPF 88888888888

### Fornecedores (`fixtures/fornecedores.fixture.js`)
Define dados padrão para testes de fornecedores:
- **Principal**: CNPJ 12345678000199
- **Secundário**: CNPJ 98765432000188

### Disciplinas (`fixtures/disciplinas.fixture.js`)
Define dados padrão para testes de disciplinas:
- **Teste**: Código TST

## 🎯 Setup e Teardown

Cada módulo de teste possui:

### `beforeAll()`
Executado **uma vez** antes de todos os testes do módulo:
- Limpa dados que possam existir de execuções anteriores
- Prepara o ambiente para os testes

### `afterAll()`
Executado **uma vez** após todos os testes do módulo:
- Remove todos os dados criados durante os testes
- Garante que o banco fica limpo para próximas execuções

## 📝 Exemplo de Uso

### Teste com Setup/Teardown

```javascript
const api = require('../helpers/api.helper');
const { usuariosFixture, cpfsParaLimpar } = require('../fixtures/usuarios.fixture');

describe('Usuários API - E2E Tests', () => {
  
  // Limpa dados ANTES dos testes
  beforeAll(async () => {
    for (const cpf of cpfsParaLimpar) {
      await api.delete(`/usuarios/${cpf}`);
    }
  });

  // Limpa dados DEPOIS dos testes
  afterAll(async () => {
    for (const cpf of cpfsParaLimpar) {
      await api.delete(`/usuarios/${cpf}`);
    }
  });

  test('Deve criar usuário', async () => {
    const response = await api.post('/usuarios', usuariosFixture.aluno);
    expect(response.status).toBe(201);
  });
});
```

## 🚀 Executando os Testes

### Executar Todos os Testes
```bash
npm test
```

### Executar Módulo Específico
```bash
npm test -- usuarios.test.js
npm test -- fornecedores.test.js
npm test -- notas.test.js
```

### Executar com Limpeza Prévia
```bash
node scripts/cleanup-database.js
npm test
```

## 🧹 Script de Limpeza Manual

Para limpar o banco manualmente antes ou depois dos testes:

```bash
cd tests-e2e
node scripts/cleanup-database.js
```

Este script remove:
- ✅ Todos os usuários de teste
- ✅ Todos os fornecedores de teste
- ✅ Todas as notas de teste
- ✅ Todas as disciplinas de teste

## 📊 Módulos e Suas Estratégias

| Módulo | Setup | Teardown | Observações |
|--------|-------|----------|-------------|
| **Auth** | ❌ Não | ❌ Não | Usa dados existentes |
| **Alunos** | ⚠️ Login | ❌ Não | Sem DELETE na API |
| **Disciplinas** | ❌ Não | ❌ Não | Sem DELETE na API |
| **Docentes** | ❌ Não | ❌ Não | Sem DELETE na API |
| **Fornecedores** | ✅ Sim | ✅ Sim | DELETE disponível |
| **Notas** | ❌ Não | ❌ Não | Sem DELETE na API |
| **Usuários** | ✅ Sim | ✅ Sim | DELETE disponível |

## ⚠️ Limitações Conhecidas

### Sem Endpoint DELETE
Alguns módulos não possuem endpoint DELETE na API:
- **Alunos**: Dados permanecem no banco
- **Disciplinas**: Dados permanecem no banco
- **Docentes**: Dados permanecem no banco
- **Notas**: Dados permanecem no banco

**Solução**: Use o script `cleanup-database.js` para limpeza via SQL.

### Dados Compartilhados
Alguns testes dependem de dados que já existem no banco:
- Auth usa CPF `11111111111` com senha `senha123`
- Alunos e Docentes são subtipos de Usuários

## 🎯 Boas Práticas

### 1. Use Fixtures
```javascript
const { usuariosFixture } = require('../fixtures/usuarios.fixture');
const response = await api.post('/usuarios', usuariosFixture.aluno);
```

### 2. Sempre Limpe Antes e Depois
```javascript
beforeAll(async () => {
  // Limpar dados antigos
});

afterAll(async () => {
  // Limpar dados criados
});
```

### 3. Use CPFs/CNPJs Únicos
Cada módulo deve usar IDs únicos para evitar conflitos.

### 4. Execute Limpeza Periódica
```bash
# Antes de commitar código
node scripts/cleanup-database.js
npm test
```

## 🔍 Troubleshooting

### Erro: "Duplicate entry"
**Causa**: Dados de testes anteriores ainda no banco  
**Solução**:
```bash
node scripts/cleanup-database.js
npm test -- <arquivo>.test.js
```

### Erro: "User not found"
**Causa**: Dados necessários não existem no banco  
**Solução**: Certifique-se que o usuário base existe:
```sql
-- CPF 11111111111 com senha: senha123 deve existir
SELECT * FROM usuarios WHERE cpf = '11111111111';
```

### Testes Falhando em Sequência
**Causa**: Dados de um teste interferindo em outro  
**Solução**: Verifique os `beforeAll` e `afterAll` de cada módulo

## 📚 Documentação Adicional

- [TESTES-AUTH.md](./TESTES-AUTH.md)
- [TESTES-ALUNOS.md](./TESTES-ALUNOS.md)
- [TESTES-DISCIPLINAS.md](./TESTES-DISCIPLINAS.md)
- [TESTES-DOCENTES.md](./TESTES-DOCENTES.md)
- [TESTES-FORNECEDORES.md](./TESTES-FORNECEDORES.md)
- [TESTES-NOTAS.md](./TESTES-NOTAS.md)
- [TESTES-USUARIOS.md](./TESTES-USUARIOS.md)
- [README-RESUMO-COMPLETO.md](./README-RESUMO-COMPLETO.md)

## ✅ Verificação Final

Antes de commitar, execute:
```bash
# 1. Limpar banco
node scripts/cleanup-database.js

# 2. Testar cada módulo individualmente
npm test -- auth.test.js
npm test -- usuarios.test.js
npm test -- fornecedores.test.js
npm test -- notas.test.js
npm test -- alunos.test.js
npm test -- docentes.test.js
npm test -- disciplinas.test.js

# 3. Testar todos juntos
npm test

# 4. Limpar novamente
node scripts/cleanup-database.js
```

Se todos os comandos acima passarem, os testes estão prontos! ✅
