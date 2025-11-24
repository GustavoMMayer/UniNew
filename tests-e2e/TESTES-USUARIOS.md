# Testes E2E - Usuários API

## 📊 Resumo dos Testes
- **Total de Testes**: 39
- **Status**: ✅ 39/39 passando (100%)
- **Tempo de Execução**: ~3s
- **Arquivo**: `tests/usuarios.test.js`

## 🎯 Cobertura de Testes

### 1. POST /usuarios (10 testes)
Testa criação de usuários de todos os tipos e validações.

#### Testes de Sucesso (5 testes)
- ✅ **Deve criar novo usuário do tipo aluno** (141ms)
  - Cria aluno com curso e situação
  - Verifica tipo_conta_id = 1
  - Valida senha não retornada
  
- ✅ **Deve criar usuário do tipo docente** (66ms)
  - Cria docente com grau acadêmico, disciplina e carga horária
  - Verifica tipo_conta_id = 2
  
- ✅ **Deve criar usuário do tipo funcionario** (65ms)
  - Cria funcionário sem campos opcionais
  - Verifica tipo_conta_id = 3
  
- ✅ **Deve criar usuário do tipo gerente** (63ms)
  - Cria gerente sem campos opcionais
  - Verifica tipo_conta_id = 4
  
- ✅ **Senha não deve ser retornada na resposta** (69ms)
  - Valida segurança: senha NUNCA retornada

#### Testes de Validação (4 testes)
- ✅ **Deve rejeitar CPF com menos de 11 dígitos** (15ms)
  - Status: 400
  - Mensagem: "CPF deve ter exatamente 11 dígitos"
  
- ✅ **Deve rejeitar email inválido** (11ms)
  - Status: 400
  - Formato de email validado pelo Joi
  
- ✅ **Deve rejeitar senha com menos de 6 caracteres** (13ms)
  - Status: 400
  - Mensagem: "Senha deve ter pelo menos 6 caracteres"
  
- ✅ **Deve rejeitar tipo_conta inválido** (12ms)
  - Status: 400
  - Aceita apenas: aluno, docente, funcionario, gerente

#### Teste de Lógica de Negócio (1 teste)
- ✅ **Tipo_conta_id deve ser gerado automaticamente** (14ms)
  - aluno → tipo_conta_id = 1
  - docente → tipo_conta_id = 2
  - funcionario → tipo_conta_id = 3
  - gerente → tipo_conta_id = 4

### 2. GET /usuarios (6 testes)
Testa listagem de usuários com diferentes filtros.

- ✅ **Deve retornar lista de usuários** (10ms)
  - Retorna array de usuários
  - Campos obrigatórios presentes
  
- ✅ **Usuários não devem conter senha** (15ms)
  - Valida segurança em listagem
  
- ✅ **Deve filtrar usuários por tipo_conta=aluno** (13ms)
  - Query param: `?tipo_conta=aluno`
  - Retorna apenas alunos
  
- ✅ **Deve filtrar usuários por tipo_conta=docente** (12ms)
  - Query param: `?tipo_conta=docente`
  - Retorna apenas docentes
  
- ✅ **Deve filtrar usuários por curso** (11ms)
  - Query param: `?curso=Engenharia`
  - Filtra por curso específico
  
- ✅ **Deve filtrar usuários por situacao=Ativo** (14ms)
  - Query param: `?situacao=Ativo`
  - Retorna apenas usuários ativos

### 3. GET /usuarios/:cpf (3 testes)
Busca usuário por CPF.

- ✅ **Deve retornar usuário por CPF válido** (12ms)
  - Busca por CPF existente
  - Retorna objeto do usuário
  
- ✅ **Não deve retornar senha do usuário** (11ms)
  - Valida segurança na busca por CPF
  
- ✅ **Deve retornar 404 para CPF inexistente** (11ms)
  - Status: 404
  - CPF não encontrado

### 4. GET /usuarios/email/:email (3 testes)
Busca usuário por email (endpoint exclusivo de usuários).

- ✅ **Deve retornar usuário por email válido** (15ms)
  - Busca por email existente
  - Retorna objeto do usuário
  
- ✅ **Não deve retornar senha do usuário** (10ms)
  - Valida segurança na busca por email
  
- ✅ **Deve retornar 404 para email inexistente** (11ms)
  - Status: 404
  - Email não encontrado

### 5. PUT /usuarios/:cpf (6 testes)
Atualização de dados do usuário.

- ✅ **Deve atualizar nome do usuário** (39ms)
  - Atualiza campo nome
  - Retorna usuário atualizado
  
- ✅ **Deve atualizar email do usuário** (43ms)
  - Atualiza campo email
  - Valida unicidade do email
  
- ✅ **Deve atualizar telefone do usuário** (18ms)
  - Atualiza campo telefone
  
- ✅ **Deve atualizar situação do aluno** (35ms)
  - Atualiza de "Ativo" para "Inativo"
  - Campo específico de alunos
  
- ✅ **Não deve permitir atualizar CPF** (34ms)
  - CPF é chave primária (imutável)
  - CPF não é alterado mesmo se enviado no body
  
- ✅ **Deve retornar 404 ao atualizar usuário inexistente** (14ms)
  - Status: 404
  - Usuário não encontrado

### 6. DELETE /usuarios/:cpf (4 testes)
Exclusão de usuários.

- ✅ **Deve excluir usuário existente** (84ms)
  - Status: 200
  - Mensagem de sucesso
  
- ✅ **Deve retornar informações do usuário excluído** (105ms)
  - Retorna dados do usuário antes da exclusão
  - Útil para confirmação/auditoria
  
- ✅ **Deve retornar 404 ao excluir usuário inexistente** (16ms)
  - Status: 404
  - CPF não encontrado
  
- ✅ **Usuário excluído não deve mais existir** (102ms)
  - Verifica que GET retorna 404 após DELETE
  - Confirma exclusão efetiva

### 7. Validações de Dados (4 testes)
Testes de regras de negócio e validações.

- ✅ **CPF deve ter formato válido** (10ms)
  - Exatamente 11 dígitos numéricos
  
- ✅ **Email deve ter formato válido** (11ms)
  - Formato de email válido
  
- ✅ **Tipo_conta deve ser válido** (10ms)
  - Enum: aluno, docente, funcionario, gerente
  
- ✅ **Tipo_conta_id deve corresponder ao tipo_conta** (10ms)
  - Mapeamento correto tipo_conta → tipo_conta_id

### 8. Performance (3 testes)
Testes de tempo de resposta.

- ✅ **Listagem de usuários deve responder em menos de 2 segundos** (12ms)
  - GET /usuarios < 2000ms
  
- ✅ **Busca por CPF deve responder em menos de 1 segundo** (9ms)
  - GET /usuarios/:cpf < 1000ms
  
- ✅ **Busca por email deve responder em menos de 1 segundo** (9ms)
  - GET /usuarios/email/:email < 1000ms

## 🔍 Características Específicas de Usuários

### Campos Discriminadores
A tabela `usuarios` usa discriminadores para diferentes tipos:

- **aluno**: campos `curso`, `situacao`
- **docente**: campos `grau_academico`, `disciplina`, `carga_horaria`
- **funcionario**: sem campos específicos
- **gerente**: sem campos específicos

### Mapeamento tipo_conta_id
Gerado automaticamente pelo service:
```javascript
{
  'aluno': 1,
  'docente': 2,
  'funcionario': 3,
  'gerente': 4
}
```

### Segurança de Senha
- ✅ Senha SEMPRE criptografada com bcrypt (10 rounds)
- ✅ Senha NUNCA retornada em nenhum endpoint
- ✅ Repository exclui senha em todos os SELECTs públicos
- ✅ Método `findForAuth` separado para autenticação

### Endpoint Exclusivo
- `GET /usuarios/email/:email` - Busca por email (único em usuários)

## 📋 Dados de Teste Criados

### CPFs Utilizados
- `55555555555` - Aluno (curso: Engenharia, situacao: Ativo)
- `66666666666` - Docente (grau: Mestrado, disciplina: Matemática)
- `77777777777` - Funcionário
- `88888888888` - Gerente
- `99999999999` - Teste de senha não retornada
- `10101010101` - Teste de DELETE
- `20202020202` - Teste de DELETE com retorno de dados
- `30303030303` - Teste de tipo_conta_id

### Emails Utilizados
- `aluno@teste.com`
- `docente@teste.com`
- `funcionario@teste.com`
- `gerente@teste.com`
- `senha@teste.com`
- `delete1@teste.com`
- `delete2@teste.com`
- `tipoconta@teste.com`

## 🎯 Implementações Validadas

### Controller
- ✅ `listarUsuarios` - Lista com filtros (tipo_conta, curso, situacao)
- ✅ `buscarPorCpf` - Busca por CPF
- ✅ `buscarPorEmail` - Busca por email (exclusivo)
- ✅ `criarUsuario` - Cria com hash de senha
- ✅ `atualizarUsuario` - Atualiza sem permitir mudança de CPF
- ✅ `deletarUsuario` - Exclui e retorna dados

### Repository
- ✅ `findAll` - SELECT exclui senha
- ✅ `findByCpf` - SELECT exclui senha
- ✅ `findByEmail` - SELECT exclui senha
- ✅ `findForAuth` - SELECT * (apenas para autenticação)
- ✅ `create` - INSERT com todos os campos
- ✅ `update` - UPDATE com proteção de CPF
- ✅ `delete` - DELETE por CPF

### Service
- ✅ Geração automática de `tipo_conta_id`
- ✅ Hash de senha com bcrypt
- ✅ Validação de dados antes do repository
- ✅ Tratamento de erros apropriado

### Validator
- ✅ CPF: exatamente 11 dígitos
- ✅ Email: formato válido
- ✅ Senha: mínimo 6 caracteres
- ✅ Tipo_conta: enum (aluno, docente, funcionario, gerente)
- ✅ Campos opcionais: curso, situacao, grau_academico, disciplina, carga_horaria

## 🚀 Como Executar

```bash
# Executar apenas testes de usuários
npm test -- usuarios.test.js

# Com cobertura
npm test -- --coverage usuarios.test.js

# Modo watch
npm test -- --watch usuarios.test.js
```

## 📈 Métricas de Performance

| Endpoint | Tempo Médio | Limite |
|----------|-------------|--------|
| GET /usuarios | ~12ms | 2000ms |
| GET /usuarios/:cpf | ~11ms | 1000ms |
| GET /usuarios/email/:email | ~12ms | 1000ms |
| POST /usuarios | ~66ms | - |
| PUT /usuarios/:cpf | ~34ms | - |
| DELETE /usuarios/:cpf | ~97ms | - |

## ✅ Conclusão

Todos os **39 testes** estão passando com sucesso! A implementação do serviço de usuários está completa e validada, incluindo:

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Busca por email (endpoint exclusivo)
- ✅ Segurança de senha (bcrypt + exclusão em queries)
- ✅ Validações completas (Joi)
- ✅ Filtros (tipo_conta, curso, situacao)
- ✅ Geração automática de tipo_conta_id
- ✅ Suporte a 4 tipos de usuário
- ✅ Performance dentro dos limites
- ✅ Tratamento de erros apropriado
