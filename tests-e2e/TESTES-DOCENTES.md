# Testes E2E - Docentes API

## Execução
```bash
npm test -- docentes.test.js
```

## Resultado
✅ **27/27 testes passando** (100%)

## Cobertura de Testes

### 1. GET /docentes - Listagem (5 testes)
- ✅ Deve retornar lista de docentes
- ✅ Deve retornar docentes com estrutura correta
- ✅ Não deve retornar senha dos docentes
- ✅ Tipo conta deve sempre ser "docente"
- ✅ Grau acadêmico deve estar presente

### 2. GET /docentes/:cpf - Busca por CPF (5 testes)
- ✅ Deve retornar docente por CPF válido
- ✅ Não deve retornar senha do docente
- ✅ Deve retornar 404 para CPF inexistente
- ✅ Docente deve ter informações acadêmicas
- ✅ Carga horária deve ser numérica

### 3. PUT /docentes/:cpf - Atualização (10 testes)
- ✅ Deve atualizar email do docente
- ✅ Deve atualizar telefone do docente
- ✅ Deve atualizar grau acadêmico
- ✅ Deve atualizar disciplina lecionada
- ✅ Deve atualizar carga horária
- ✅ Deve atualizar múltiplos campos simultaneamente
- ✅ Deve retornar 404 ao atualizar docente inexistente
- ✅ Não deve permitir atualizar CPF
- ✅ Não deve permitir atualizar tipo_conta
- ✅ Deve retornar docente atualizado com estrutura completa

### 4. Validações de Dados (4 testes)
- ✅ CPF deve ter formato válido
- ✅ Email deve ter formato válido
- ✅ Grau acadêmico deve ser válido
- ✅ Carga horária deve ser positiva

### 5. Performance (2 testes)
- ✅ Listagem de docentes deve responder em menos de 2 segundos
- ✅ Busca por CPF deve responder em menos de 1 segundo

### 6. Integração (1 teste)
- ✅ Disciplina do docente deve existir na tabela de disciplinas

## Estrutura de Dados - Docente

```json
{
  "cpf": "22222222222",
  "nome": "Docente Teste",
  "email": "docente@teste.com",
  "telefone": "0000-0002",
  "tipo_conta": "docente",
  "tipo_conta_id": null,
  "grau_academico": "Mestrado",
  "disciplina": "Algoritmos",
  "carga_horaria": 40
}
```

### Campos Obrigatórios
- `cpf` (11 dígitos)
- `nome`
- `tipo_conta` (sempre "docente")

### Campos Específicos de Docente
- `grau_academico`: Graduação, Especialização, Mestrado, Doutorado, Pós-Doutorado
- `disciplina`: Nome da disciplina lecionada
- `carga_horaria`: Horas semanais (0-168)

### Campos Imutáveis
- `cpf`: Não pode ser alterado após criação
- `tipo_conta`: Sempre "docente", não pode ser alterado

### Segurança
- ❌ Campo `senha` **NUNCA** é retornado nas respostas

## Validações Implementadas

### Atualização (PUT)
- Email deve ser válido
- Carga horária: 0 a 168 horas semanais
- Pelo menos um campo deve ser enviado
- Campos imutáveis: cpf, tipo_conta

## Dados de Teste

### Docente Teste Principal
- CPF: `22222222222`
- Nome: Docente Teste
- Email: docente@teste.com
- Grau Acadêmico: Mestrado
- Disciplina: Algoritmos
- Carga Horária: 40h

## Integração com Outros Serviços

### Disciplinas
- Validação: disciplina do docente deve existir na tabela de disciplinas
- Relacionamento: Docente ↔ Disciplina (por nome)

## Métricas de Performance

### Tempos de Resposta
- Listagem: < 2000ms
- Busca por CPF: < 1000ms
- Atualização: < 1000ms

### Tempo Total de Execução
- 27 testes em ~1.5s
- Média: ~55ms por teste

## Próximos Passos

1. ✅ Auth (15/15 testes)
2. ✅ Alunos (25/25 testes)
3. ✅ Disciplinas (25/25 testes)
4. ✅ Docentes (27/27 testes) - **CONCLUÍDO**
5. ⬜ Fornecedores (pendente)
6. ⬜ Notas (pendente)
7. ⬜ Usuários (pendente)
