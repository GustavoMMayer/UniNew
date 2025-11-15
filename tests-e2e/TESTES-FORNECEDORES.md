# Testes E2E - Fornecedores API

## Execução
```bash
npm test -- fornecedores.test.js
```

## Resultado
✅ **38/38 testes passando** (100%)

## Cobertura de Testes

### 1. POST /fornecedores - Criação (11 testes)
- ✅ Deve criar novo fornecedor
- ✅ Contatos devem ser array de strings
- ✅ Serviços devem ser array de strings
- ✅ Deve rejeitar CNPJ com menos de 14 dígitos
- ✅ Deve rejeitar CNPJ com mais de 14 dígitos
- ✅ Deve rejeitar CNPJ com caracteres não numéricos
- ✅ Deve rejeitar fornecedor sem razão social
- ✅ Deve rejeitar fornecedor sem contatos
- ✅ Deve rejeitar fornecedor com array vazio de contatos
- ✅ Deve rejeitar fornecedor sem serviços
- ✅ Deve rejeitar fornecedor com array vazio de serviços

### 2. GET /fornecedores - Listagem (4 testes)
- ✅ Deve retornar lista de fornecedores
- ✅ Deve retornar fornecedores com estrutura correta
- ✅ Contatos devem ser arrays
- ✅ Serviços devem ser arrays

### 3. GET /fornecedores/:cnpj - Busca por CNPJ (4 testes)
- ✅ Deve retornar fornecedor por CNPJ válido
- ✅ Deve retornar 404 para CNPJ inexistente
- ✅ Fornecedor deve ter contatos em formato de array
- ✅ Fornecedor deve ter serviços em formato de array

### 4. PUT /fornecedores/:cnpj - Atualização (7 testes)
- ✅ Deve atualizar razão social
- ✅ Deve atualizar contatos
- ✅ Deve atualizar serviços
- ✅ Deve atualizar múltiplos campos simultaneamente
- ✅ Deve retornar 404 ao atualizar fornecedor inexistente
- ✅ Não deve permitir atualizar CNPJ
- ✅ Deve rejeitar atualização com contatos vazio
- ✅ Deve rejeitar atualização com serviços vazio

### 5. DELETE /fornecedores/:cnpj - Exclusão (4 testes)
- ✅ Deve excluir fornecedor existente
- ✅ Deve retornar informações do fornecedor excluído
- ✅ Deve retornar 404 ao excluir fornecedor inexistente
- ✅ Fornecedor excluído não deve mais existir no banco

### 6. Validações de Dados (4 testes)
- ✅ CNPJ deve ter formato válido
- ✅ Razão social deve ser string não vazia
- ✅ Contatos deve conter pelo menos um item
- ✅ Serviços deve conter pelo menos um item

### 7. Performance (3 testes)
- ✅ Listagem de fornecedores deve responder em menos de 2 segundos
- ✅ Busca por CNPJ deve responder em menos de 1 segundo
- ✅ Criação de fornecedor deve responder em menos de 2 segundos

## Estrutura de Dados - Fornecedor

```json
{
  "cnpj": "12345678000190",
  "razao_social": "Empresa Teste LTDA",
  "contatos": [
    "contato@teste.com",
    "11987654321"
  ],
  "servicos": [
    "Limpeza",
    "Manutenção"
  ]
}
```

### Campos Obrigatórios
- `cnpj` (14 dígitos numéricos)
- `razao_social` (string não vazia)
- `contatos` (array de strings, mínimo 1 item)
- `servicos` (array de strings, mínimo 1 item)

### Campos Imutáveis
- `cnpj`: Não pode ser alterado após criação (chave primária)

### Tipos de Dados Especiais
- `contatos`: Array JSON (armazenado como JSON no MySQL)
- `servicos`: Array JSON (armazenado como JSON no MySQL)

## Validações Implementadas

### Criação (POST)
- CNPJ: exatamente 14 dígitos numéricos
- Razão social: obrigatória
- Contatos: array não vazio de strings
- Serviços: array não vazio de strings

### Atualização (PUT)
- CNPJ: imutável
- Contatos: se enviado, deve ter pelo menos 1 item
- Serviços: se enviado, deve ter pelo menos 1 item
- Pelo menos um campo deve ser enviado

## Operações CRUD Completas

### CREATE (POST)
- Endpoint: `POST /api/fornecedores`
- Status Success: `201 Created`
- Retorna: Fornecedor criado com todos os campos

### READ (GET)
- Listagem: `GET /api/fornecedores`
- Busca: `GET /api/fornecedores/:cnpj`
- Status Success: `200 OK`
- Status Not Found: `404`

### UPDATE (PUT)
- Endpoint: `PUT /api/fornecedores/:cnpj`
- Status Success: `200 OK`
- Status Not Found: `404`
- Retorna: Fornecedor atualizado

### DELETE
- Endpoint: `DELETE /api/fornecedores/:cnpj`
- Status Success: `200 OK`
- Status Not Found: `404`
- Retorna: Mensagem de sucesso + dados do fornecedor excluído

## Dados de Teste

### Fornecedor Teste Principal
- CNPJ: `12345678000190`
- Razão Social: Empresa Teste LTDA
- Contatos: ["contato@teste.com", "11987654321"]
- Serviços: ["Limpeza", "Manutenção"]

## Características Técnicas

### Parse Seguro de JSON
- Repository implementa `parseJSON()` helper
- Trata valores inválidos retornando array vazio
- Evita crashes por JSON malformado no banco

### Validação de Arrays
- Contatos e serviços devem ser arrays
- Mínimo de 1 item em cada array
- Itens devem ser strings

## Métricas de Performance

### Tempos de Resposta
- Listagem: < 2000ms
- Busca por CNPJ: < 1000ms
- Criação: < 2000ms

### Tempo Total de Execução
- 38 testes em ~1.8s
- Média: ~47ms por teste

## Diferenças em Relação a Outros Serviços

### Identificador Único
- Alunos/Docentes: CPF (11 dígitos)
- Fornecedores: CNPJ (14 dígitos)

### Campos JSON
- Fornecedores: `contatos` e `servicos` são arrays JSON
- Alunos/Docentes: campos simples (string, int)

### Operações CRUD
- Fornecedores: **CRUD completo** (CREATE, READ, UPDATE, DELETE)
- Alunos/Docentes: Sem CREATE e DELETE nos testes anteriores

## Próximos Passos

1. ✅ Auth (15/15 testes)
2. ✅ Alunos (25/25 testes)
3. ✅ Disciplinas (25/25 testes)
4. ✅ Docentes (27/27 testes)
5. ✅ Fornecedores (38/38 testes) - **CONCLUÍDO**
6. ⬜ Notas (pendente)
7. ⬜ Usuários (pendente)
