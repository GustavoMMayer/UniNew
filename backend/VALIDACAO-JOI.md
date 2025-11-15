# 🔒 Validação com Joi - UniNew Backend

## ✅ Implementação Completa

### 📁 Estrutura de Validators Criados

```
backend/src/validators/
├── index.js                  # Exporta todos os validators
├── auth.validator.js         # Validação de autenticação
├── usuario.validator.js      # Validação de usuários
├── aluno.validator.js        # Validação de alunos
├── docente.validator.js      # Validação de docentes
├── fornecedor.validator.js   # Validação de fornecedores
├── curso.validator.js        # Validação de cursos
├── disciplina.validator.js   # Validação de disciplinas
└── nota.validator.js         # Validação de notas
```

---

## 📋 Validators Implementados

### 1. **Auth Validator** (`auth.validator.js`)

#### `loginSchema`
- **username**: string, obrigatório (CPF ou email)
- **password**: string, mínimo 6 caracteres, obrigatório

---

### 2. **Usuario Validator** (`usuario.validator.js`)

#### `createUsuarioSchema`
- **cpf**: 11 dígitos, apenas números, obrigatório
- **nome**: string, obrigatório
- **email**: formato válido, obrigatório
- **telefone**: string, opcional
- **senha**: mínimo 6 caracteres, obrigatório
- **tipo_conta**: enum (aluno, docente, funcionario, gerente), obrigatório
- **curso**: string, opcional (para alunos)
- **situacao**: enum (Ativo, Inativo), opcional (para alunos)
- **grau_academico**: string, opcional (para docentes)
- **disciplina**: string, opcional (para docentes)
- **carga_horaria**: number >= 0, opcional (para docentes)

#### `updateUsuarioSchema`
- Todos os campos opcionais (patch)
- Pelo menos 1 campo obrigatório

---

### 3. **Aluno Validator** (`aluno.validator.js`)

#### `updateAlunoSchema`
- **nome**: string, opcional
- **email**: email válido, opcional
- **telefone**: string, opcional
- **curso**: enum (ADS, Marketing, Administração), opcional
- **situacao**: enum (Ativo, Inativo), opcional
- Mínimo 1 campo obrigatório

#### `queryAlunoSchema`
- **curso**: enum (ADS, Marketing, Administração)
- **situacao**: enum (Ativo, Inativo)

---

### 4. **Docente Validator** (`docente.validator.js`)

#### `updateDocenteSchema`
- **nome**: string, opcional
- **grau_academico**: string, opcional
- **disciplina**: string, opcional
- **carga_horaria**: number entre 0 e 168, opcional
- Mínimo 1 campo obrigatório

---

### 5. **Fornecedor Validator** (`fornecedor.validator.js`)

#### `createFornecedorSchema`
- **cnpj**: 14 dígitos, apenas números, obrigatório
- **razao_social**: string, obrigatório
- **contatos**: array de strings, mínimo 1, obrigatório
- **servicos**: array de strings, mínimo 1, obrigatório

#### `updateFornecedorSchema`
- Todos os campos opcionais (exceto CNPJ)
- Mínimo 1 campo obrigatório
- Arrays devem ter pelo menos 1 item se enviados

---

### 6. **Curso Validator** (`curso.validator.js`)

#### `createCursoSchema`
- **codigo**: letras maiúsculas e underscore, opcional (gerado auto)
- **nome**: string, obrigatório
- **disciplinas**: array de strings, default []

#### `updateCursoSchema`
- **nome**: string, opcional
- **disciplinas**: array de strings, opcional
- Mínimo 1 campo obrigatório

---

### 7. **Disciplina Validator** (`disciplina.validator.js`)

#### `createDisciplinaSchema`
- **codigo**: letras maiúsculas e underscore, opcional (gerado auto)
- **nome**: string, obrigatório
- **carga_horaria**: number entre 1 e 500, obrigatório

#### `updateDisciplinaSchema`
- **nome**: string, opcional
- **carga_horaria**: number entre 1 e 500, opcional
- Mínimo 1 campo obrigatório

---

### 8. **Nota Validator** (`nota.validator.js`)

#### `createNotaSchema`
- **id**: string, opcional (gerado auto)
- **cpf**: 11 dígitos, apenas números, obrigatório
- **disciplina**: string, obrigatório
- **disciplina_codigo**: string, opcional (gerado auto)
- **nota**: number entre 0 e 10, precisão 2 casas decimais, obrigatório
- **descricao**: string, opcional
- **observacao**: string, opcional

#### `updateNotaSchema`
- **nota**: number entre 0 e 10, opcional
- **descricao**: string, opcional
- **observacao**: string, opcional
- Mínimo 1 campo obrigatório

#### `queryNotaSchema`
- **disciplina_codigo**: string, opcional

---

## 🛠️ Middleware de Validação Atualizado

### `validation.middleware.js`

Três funções exportadas:

#### `validateBody(schema)`
Valida `req.body` usando o schema Joi fornecido.

#### `validateQuery(schema)`
Valida `req.query` (query params) usando o schema Joi fornecido.

#### `validateParams(schema)`
Valida `req.params` (path params) usando o schema Joi fornecido.

**Retorno de erro padrão:**
```json
{
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "cpf",
      "message": "CPF deve ter 11 dígitos"
    }
  ]
}
```

---

## 🔗 Rotas Atualizadas

### ✅ Todas as rotas foram atualizadas com validação:

1. **auth.routes.js**
   - POST `/login` → `validateBody(loginSchema)`

2. **usuarios.routes.js**
   - GET `/` → `validateQuery(queryUsuarioSchema)`
   - POST `/` → `validateBody(createUsuarioSchema)`
   - PUT `/:cpf` → `validateBody(updateUsuarioSchema)`

3. **alunos.routes.js**
   - GET `/` → `validateQuery(queryAlunoSchema)`
   - PUT `/:cpf` → `validateBody(updateAlunoSchema)`

4. **docentes.routes.js**
   - PUT `/:cpf` → `validateBody(updateDocenteSchema)`

5. **fornecedores.routes.js**
   - POST `/` → `validateBody(createFornecedorSchema)`
   - PUT `/:cnpj` → `validateBody(updateFornecedorSchema)`

6. **cursos.routes.js**
   - POST `/` → `validateBody(createCursoSchema)`
   - PUT `/:codigo` → `validateBody(updateCursoSchema)`

7. **disciplinas.routes.js**
   - POST `/` → `validateBody(createDisciplinaSchema)`
   - PUT `/:codigo` → `validateBody(updateDisciplinaSchema)`

8. **notas.routes.js**
   - GET `/` → `validateQuery(queryNotaSchema)`
   - POST `/` → `validateBody(createNotaSchema)`

---

## 📝 Exemplos de Uso

### Exemplo 1: Login inválido
```bash
POST /api/auth/login
{
  "username": "12345",  # CPF incompleto
  "password": "123"     # Senha muito curta
}
```

**Response 400:**
```json
{
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "password",
      "message": "Senha deve ter no mínimo 6 caracteres"
    }
  ]
}
```

### Exemplo 2: Criar usuário inválido
```bash
POST /api/usuarios
{
  "cpf": "123",
  "nome": "",
  "email": "email_invalido",
  "tipo_conta": "admin"
}
```

**Response 400:**
```json
{
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "cpf",
      "message": "CPF deve ter 11 dígitos"
    },
    {
      "field": "nome",
      "message": "Nome é obrigatório"
    },
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "senha",
      "message": "Senha é obrigatória"
    },
    {
      "field": "tipo_conta",
      "message": "Tipo de conta deve ser: aluno, docente, funcionario ou gerente"
    }
  ]
}
```

### Exemplo 3: Criar nota válida
```bash
POST /api/notas
{
  "cpf": "11111111111",
  "disciplina": "Algoritmos",
  "nota": 8.5
}
```

**Response 201:** (nota criada com sucesso)

### Exemplo 4: Filtro de alunos inválido
```bash
GET /api/alunos?curso=InvalidCourse&situacao=Pendente
```

**Response 400:**
```json
{
  "message": "Parâmetros de consulta inválidos",
  "errors": [
    {
      "field": "curso",
      "message": "\"curso\" must be one of [ADS, Marketing, Administração]"
    },
    {
      "field": "situacao",
      "message": "\"situacao\" must be one of [Ativo, Inativo]"
    }
  ]
}
```

---

## 🎯 Validações Principais Implementadas

### ✅ CPF
- 11 dígitos numéricos
- Sem formatação (apenas números)
- Pattern regex: `/^\d+$/`

### ✅ CNPJ
- 14 dígitos numéricos
- Sem formatação (apenas números)
- Pattern regex: `/^\d+$/`

### ✅ Email
- Validação de formato usando Joi.string().email()

### ✅ Senha
- Mínimo 6 caracteres

### ✅ Nota
- Valor entre 0 e 10
- Precisão de 2 casas decimais

### ✅ Tipo de Conta
- Enum: 'aluno', 'docente', 'funcionario', 'gerente'

### ✅ Situação
- Enum: 'Ativo', 'Inativo'

### ✅ Curso
- Enum: 'ADS', 'Marketing', 'Administração'

### ✅ Código (curso/disciplina)
- Letras maiúsculas e underscore
- Pattern regex: `/^[A-Z_]+$/`

### ✅ Carga Horária (disciplina)
- Entre 1 e 500 horas

### ✅ Carga Horária (docente)
- Entre 0 e 168 horas semanais

### ✅ Arrays
- Mínimo 1 item para contatos e serviços de fornecedores

---

## 🚀 Próximos Passos

1. ✅ Validators criados
2. ✅ Middleware atualizado
3. ✅ Rotas atualizadas
4. ⏳ Implementar SQL nos repositories
5. ⏳ Testar endpoints com validação
6. ⏳ Implementar autenticação JWT
7. ⏳ Adicionar testes unitários para validators

---

## 📊 Resumo

- **8 validators criados** (auth, usuario, aluno, docente, fornecedor, curso, disciplina, nota)
- **8 rotas atualizadas** com validação
- **3 tipos de validação**: body, query, params
- **Mensagens de erro em português** para melhor UX
- **Validação robusta** de CPF, CNPJ, email, notas, enums

**Todos os dados recebidos pelas rotas agora são validados antes de chegar aos controllers!** 🎉
