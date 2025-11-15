# Testes E2E - Notas API

## Execução
```bash
npm test -- notas.test.js
```

## Resultado
✅ **32/32 testes passando** (100%)

## Cobertura de Testes

### 1. POST /notas - Criação (13 testes)
- ✅ Deve criar nova nota
- ✅ ID deve ser gerado automaticamente no formato cpf_disciplina_codigo
- ✅ Deve aceitar nota com valor inteiro
- ✅ Deve aceitar nota com 2 casas decimais
- ✅ Deve aceitar nota zero
- ✅ Deve aceitar descrição opcional
- ✅ Deve rejeitar CPF com menos de 11 dígitos
- ✅ Deve rejeitar CPF com mais de 11 dígitos
- ✅ Deve rejeitar CPF com caracteres não numéricos
- ✅ Deve rejeitar nota sem disciplina
- ✅ Deve rejeitar nota sem valor numérico
- ✅ Deve rejeitar nota menor que 0
- ✅ Deve rejeitar nota maior que 10

### 2. GET /notas - Listagem (4 testes)
- ✅ Deve retornar lista de notas
- ✅ Deve retornar notas com estrutura correta
- ✅ Deve filtrar notas por disciplina_codigo
- ✅ Notas devem estar ordenadas por data de criação (mais recentes primeiro)

### 3. GET /notas/aluno/:cpf - Buscar notas por aluno (3 testes)
- ✅ Deve retornar notas de um aluno específico
- ✅ Deve retornar array vazio para aluno sem notas
- ✅ Notas do aluno devem estar ordenadas por data

### 4. GET /notas/:id - Buscar por ID (2 testes)
- ✅ Deve retornar nota por ID válido
- ✅ Deve retornar 404 para ID inexistente

### 5. Validações de Dados (4 testes)
- ✅ CPF deve ter formato válido
- ✅ Nota deve estar entre 0 e 10
- ✅ Disciplina deve ser string não vazia
- ✅ Disciplina_codigo deve estar presente

### 6. Performance (3 testes)
- ✅ Listagem de notas deve responder em menos de 2 segundos
- ✅ Busca por ID deve responder em menos de 1 segundo
- ✅ Busca por aluno deve responder em menos de 1 segundo

### 7. Integração (3 testes)
- ✅ CPF da nota deve corresponder a um aluno existente
- ✅ Disciplina_codigo da nota deve existir na tabela de disciplinas
- ✅ Aluno pode ter múltiplas notas

## Estrutura de Dados - Nota

```json
{
  "id": "11111111111_ALG",
  "cpf": "11111111111",
  "disciplina": "Algoritmos",
  "disciplina_codigo": "ALG",
  "nota": 8.5,
  "descricao": "Prova 1",
  "created_at": "2025-11-15T15:53:00.000Z"
}
```

### Campos Obrigatórios
- `cpf` (11 dígitos numéricos)
- `disciplina` (string não vazia)
- `nota` (número entre 0 e 10, até 2 casas decimais)

### Campos Opcionais
- `id` (gerado automaticamente como `{cpf}_{disciplina_codigo}` se não fornecido)
- `disciplina_codigo` (gerado automaticamente das 3 primeiras letras da disciplina se não fornecido)
- `descricao` (string opcional)
- `observacao` (string opcional)

### Campos Auto-gerados
- `created_at` (timestamp de criação)

## Validações Implementadas

### Criação (POST)
- CPF: exatamente 11 dígitos numéricos
- Disciplina: obrigatória, string não vazia
- Nota: obrigatória, entre 0 e 10, até 2 casas decimais
- ID: gerado automaticamente se não fornecido
- Disciplina_codigo: gerado automaticamente se não fornecido

### Consulta (GET)
- Query param `disciplina_codigo`: opcional para filtro

## Características Especiais

### Geração Automática de ID
- Formato: `{cpf}_{disciplina_codigo}`
- Exemplo: `11111111111_ALG`
- Garante unicidade: cada aluno tem 1 nota por disciplina

### Filtros de Listagem
- Endpoint `/notas` aceita query param `disciplina_codigo`
- Exemplo: `GET /notas?disciplina_codigo=ALG`
- Retorna apenas notas da disciplina especificada

### Ordenação
- Todas as listagens ordenadas por `created_at DESC`
- Notas mais recentes aparecem primeiro

### Relacionamentos
- `cpf` → Foreign Key para tabela `usuarios` (alunos)
- `disciplina_codigo` → Foreign Key para tabela `disciplinas`

## Operações CRUD

### CREATE (POST)
- Endpoint: `POST /api/notas`
- Status Success: `201 Created`
- Retorna: Nota criada com todos os campos

### READ (GET)
- Listagem: `GET /api/notas`
- Listagem por aluno: `GET /api/notas/aluno/:cpf`
- Busca por ID: `GET /api/notas/:id`
- Status Success: `200 OK`
- Status Not Found: `404` (apenas para busca por ID)

## Dados de Teste

### Nota Teste Principal
- ID: `11111111111_ALG` (gerado automaticamente)
- CPF: `11111111111` (Aluno Teste)
- Disciplina: Algoritmos
- Disciplina_codigo: ALG
- Nota: 8.5
- Descrição: Prova 1

### Disciplinas Criadas para Testes
- ALG: Algoritmos
- LPG: Linguagem de Programação
- ESD: Estruturas de Dados
- BDD: Banco de Dados
- PWB: Programação Web
- RED: Redes de Computadores
- TST: Disciplina de Teste

## Validações de Integridade

### Referencial
- CPF deve existir na tabela `usuarios` (tipo_conta = 'aluno')
- Disciplina_codigo deve existir na tabela `disciplinas`
- Violação de FK retorna erro 500 (database constraint)

### Unicidade
- ID é chave primária
- Combinação `cpf + disciplina_codigo` deve ser única

## Métricas de Performance

### Tempos de Resposta
- Listagem geral: < 2000ms
- Busca por ID: < 1000ms
- Busca por aluno: < 1000ms

### Tempo Total de Execução
- 32 testes em ~1.9s
- Média: ~59ms por teste

## Diferenças em Relação a Outros Serviços

### ID Composto
- Notas: ID gerado automaticamente (`cpf_disciplina_codigo`)
- Outros: ID simples (CPF, CNPJ, código)

### Múltiplos Relacionamentos
- Notas: FK para `usuarios` E `disciplinas`
- Outros serviços: geralmente 1 ou nenhuma FK

### Endpoint Específico por Aluno
- `/notas/aluno/:cpf` retorna todas as notas do aluno
- Endpoint dedicado para consulta educacional

### Filtro Query Params
- Suporta `?disciplina_codigo=XXX` para filtrar
- Validação de query params com Joi

## Próximos Passos

1. ✅ Auth (15/15 testes)
2. ✅ Alunos (25/25 testes)
3. ✅ Disciplinas (25/25 testes)
4. ✅ Docentes (27/27 testes)
5. ✅ Fornecedores (38/38 testes)
6. ✅ Notas (32/32 testes) - **CONCLUÍDO**
7. ⬜ Usuários (pendente)

**Total: 162/162 testes passando!** 🎉
