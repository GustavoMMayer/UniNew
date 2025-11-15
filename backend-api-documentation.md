# 📋 Documentação da API Backend - UniNew

## 🎯 Visão Geral

Sistema de gerenciamento acadêmico que permite cadastro e gestão de **alunos**, **docentes**, **fornecedores**, **cursos**, **disciplinas** e **notas**.

**Base URL**: `/api` ou `http://localhost:3000/api` (sugestão)

---

## 🔐 Autenticação

### POST `/auth/login`
Autentica um usuário no sistema.

**Request Body:**
```json
{
  "username": "11111111111",  // CPF (11 dígitos) ou email
  "password": "senha123"
}
```

**Regras:**
- `username` aceita **CPF** (apenas números) **ou** **email** (formato válido)
- `password` é obrigatório (mínimo 6 caracteres)
- O backend identifica automaticamente se é CPF ou email

**Exemplos válidos:**
```json
// Login com CPF
{
  "username": "11111111111",
  "password": "senha123"
}

// Login com email
{
  "username": "aluno@teste.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "cpf": "11111111111",
    "nome": "Aluno Teste",
    "email": "aluno@teste.com",
    "telefone": "0000-0001",
    "tipo_conta": "aluno",
    "tipo_conta_id": 1
  }
}
```

**Mapeamento de IDs:**
- `1` - Aluno
- `2` - Docente
- `3` - Funcionário
- `4` - Gerente

**Response (401 Unauthorized):**
```json
{
  "message": "Credenciais inválidas"
}
```

---

### POST `/auth/logout`
Invalida o token do usuário (logout).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "ok": true
}
```

---

## 👤 Usuários

### GET `/usuarios`
Lista todos os usuários ou filtra por parâmetros não-únicos.

**Query Parameters (opcionais):**
- `tipo_conta` - Filtrar por tipo (aluno, docente, funcionario, gerente)
- `curso` - Filtrar por curso
- `situacao` - Filtrar por situação

**Response (200 OK):**
```json
[
  {
    "cpf": "11111111111",
    "nome": "Aluno Teste",
    "email": "aluno@teste.com",
    "telefone": "0000-0001",
    "tipo_conta": "aluno",
    "tipo_conta_id": 1,
    "curso": "ADS",
    "situacao": "Ativo"
  },
  {
    "cpf": "22222222222",
    "nome": "Docente Teste",
    "email": "docente@teste.com",
    "telefone": "0000-0002",
    "tipo_conta": "docente",
    "tipo_conta_id": 2,
    "grau_academico": "Mestrado",
    "disciplina": "Algoritmos",
    "carga_horaria": 40
  }
]
```

**Observações:**
- Sempre retorna um **array** (mesmo que vazio)
- Para buscar por CPF (retorno único), use `GET /usuarios/:cpf`
- Para buscar por email (retorno único), use `GET /usuarios/email/:email`

---

### GET `/usuarios/:cpf`
Busca um usuário específico por CPF (chave única).

**Path Parameters:**
- `cpf` - CPF do usuário (11 dígitos, apenas números)

**Response (200 OK):**
```json
{
  "cpf": "11111111111",
  "nome": "Aluno Teste",
  "email": "aluno@teste.com",
  "telefone": "0000-0001",
  "tipo_conta": "aluno",
  "tipo_conta_id": 1,
  "curso": "ADS",
  "situacao": "Ativo"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Não encontrado"
}
```

---

### GET `/usuarios/email/:email`
Busca um usuário específico por email (campo único).

**Path Parameters:**
- `email` - Email do usuário (URL encoded)

**Exemplo:** `GET /usuarios/email/aluno%40teste.com`

**Response (200 OK):**
```json
{
  "cpf": "11111111111",
  "nome": "Aluno Teste",
  "email": "aluno@teste.com",
  "telefone": "0000-0001",
  "tipo_conta": "aluno",
  "tipo_conta_id": 1,
  "curso": "ADS",
  "situacao": "Ativo"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Não encontrado"
}
```

---

### POST `/usuarios`
Cria um novo usuário.

**Request Body:**
```json
{
  "cpf": "12345678901",
  "nome": "Nome Completo",
  "email": "usuario@example.com",
  "telefone": "11999999999",
  "senha": "senha123",
  "tipo_conta": "aluno"
}
```

**Campos obrigatórios:**
- `cpf` (string - 11 dígitos)
- `nome` (string)
- `email` (string - formato válido)
- `senha` (string - mínimo 6 caracteres)
- `tipo_conta` (enum: "aluno" | "docente" | "funcionario" | "gerente")

**Campos automáticos:**
- `tipo_conta_id` - Gerado automaticamente baseado no `tipo_conta`

**Campos opcionais (dependem do tipo_conta):**
- Para **aluno**: `curso`, `situacao`
- Para **docente**: `grau_academico`, `disciplina`, `carga_horaria`

**Response (201 Created):**
```json
{
  "cpf": "12345678901",
  "nome": "Nome Completo",
  "email": "usuario@example.com",
  "telefone": "11999999999",
  "tipo_conta": "aluno",
  "tipo_conta_id": 1
}
```

**Response (409 Conflict):**
```json
{
  "message": "Registro com essa chave já existe"
}
```

---

### PUT `/usuarios/:cpf`
Atualiza um usuário existente.

**Path Parameters:**
- `cpf` - CPF do usuário a ser atualizado

**Request Body:**
```json
{
  "nome": "Nome Atualizado",
  "email": "novoemail@example.com",
  "telefone": "11988888888",
  "curso": "Marketing",
  "situacao": "Ativo"
}
```

**Observações:**
- O CPF **não pode** ser alterado
- Apenas os campos enviados serão atualizados (patch)
- Senha não retorna no response

**Response (200 OK):**
```json
{
  "cpf": "12345678901",
  "nome": "Nome Atualizado",
  "email": "novoemail@example.com",
  "telefone": "11988888888",
  "tipo_conta": "aluno",
  "tipo_conta_id": 1,
  "curso": "Marketing",
  "situacao": "Ativo"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Não encontrado para atualizar"
}
```

---

### DELETE `/usuarios/:cpf`
Exclui um usuário.

**Path Parameters:**
- `cpf` - CPF do usuário a ser excluído

**Response (200 OK):**
```json
{
  "cpf": "12345678901",
  "nome": "Nome Completo",
  "email": "usuario@example.com"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Não encontrado para deletar"
}
```

---

## 🎓 Alunos

### GET `/alunos`
Lista todos os alunos ou filtra por parâmetros não-únicos.

**Query Parameters (opcionais):**
- `curso` - Filtrar por curso
- `situacao` - Filtrar por situação

**Response (200 OK):**
```json
[
  {
    "cpf": "11111111111",
    "nome": "Aluno Teste",
    "email": "aluno@teste.com",
    "telefone": "0000-0001",
    "curso": "ADS",
    "situacao": "Ativo"
  }
]
```

**Observações:**
- Sempre retorna um **array** (mesmo que vazio)
- Para buscar por CPF (retorno único), use `GET /alunos/:cpf`

---

### GET `/alunos/:cpf`
Busca um aluno específico por CPF (chave única).

**Path Parameters:**
- `cpf` - CPF do aluno (11 dígitos, apenas números)

**Response (200 OK):**
```json
{
  "cpf": "11111111111",
  "nome": "Aluno Teste",
  "email": "aluno@teste.com",
  "telefone": "0000-0001",
  "curso": "ADS",
  "situacao": "Ativo"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Aluno não encontrado"
}
```

---

### PUT `/alunos/:cpf`
Atualiza informações do aluno.

**Request Body:**
```json
{
  "cpf": "11111111111",
  "nome": "Aluno Teste",
  "email": "aluno@teste.com",
  "telefone": "0000-0001",
  "curso": "Marketing",
  "situacao": "Inativo"
}
```

**Campos:**
- `curso` (enum: "ADS" | "Marketing" | "Administração")
- `situacao` (enum: "Ativo" | "Inativo")

---

## 👨‍🏫 Docentes

### GET `/docentes`
Lista todos os docentes.

**Response (200 OK):**
```json
[
  {
    "cpf": "22222222222",
    "nome": "Docente Teste",
    "grau_academico": "Mestrado",
    "disciplina": "Algoritmos",
    "carga_horaria": 40
  }
]
```

**Observações:**
- Sempre retorna um **array** (mesmo que vazio)
- Para buscar por CPF (retorno único), use `GET /docentes/:cpf`

---

### GET `/docentes/:cpf`
Busca um docente específico por CPF (chave única).

**Path Parameters:**
- `cpf` - CPF do docente (11 dígitos, apenas números)

**Response (200 OK):**
```json
{
  "cpf": "22222222222",
  "nome": "Docente Teste",
  "grau_academico": "Mestrado",
  "disciplina": "Algoritmos",
  "carga_horaria": 40
}
```

**Response (404 Not Found):**
```json
{
  "message": "Docente não encontrado"
}
```

---

### PUT `/docentes/:cpf`
Atualiza informações do docente.

**Request Body:**
```json
{
  "cpf": "22222222222",
  "grau_academico": "Doutorado",
  "disciplina": "Estrutura de Dados",
  "carga_horaria": 60
}
```

**Campos:**
- `grau_academico` (string) - Ex: "Graduação", "Especialização", "Mestrado", "Doutorado"
- `disciplina` (string) - Nome da disciplina principal
- `carga_horaria` (number) - Horas semanais

---

## 🏢 Fornecedores

### GET `/fornecedores`
Lista todos os fornecedores.

**Response (200 OK):**
```json
[
  {
    "cnpj": "12345678000199",
    "razao_social": "Fornecedor Teste LTDA",
    "contatos": ["contato@fornecedor.com"],
    "servicos": ["Reciclagem", "Limpeza"]
  }
]
```

---

### GET `/fornecedores/:cnpj`
Busca um fornecedor específico por CNPJ.

**Response (200 OK):**
```json
{
  "cnpj": "12345678000199",
  "razao_social": "Fornecedor Teste LTDA",
  "contatos": ["contato@fornecedor.com"],
  "servicos": ["Reciclagem"]
}
```

---

### POST `/fornecedores`
Cria um novo fornecedor.

**Request Body:**
```json
{
  "cnpj": "12345678000199",
  "razao_social": "Fornecedor Teste LTDA",
  "contatos": ["email@fornecedor.com", "11999999999"],
  "servicos": ["Reciclagem", "Limpeza"]
}
```

**Campos obrigatórios:**
- `cnpj` (string - 14 dígitos)
- `razao_social` (string)
- `contatos` (array de strings)
- `servicos` (array de strings)

---

### PUT `/fornecedores/:cnpj`
Atualiza um fornecedor.

**Request Body:**
```json
{
  "razao_social": "Novo Nome LTDA",
  "contatos": ["novoemail@fornecedor.com"],
  "servicos": ["Limpeza", "Segurança"]
}
```

---

### DELETE `/fornecedores/:cnpj`
Exclui um fornecedor.

**Response (200 OK):**
```json
{
  "cnpj": "12345678000199",
  "razao_social": "Fornecedor Teste LTDA"
}
```

---

## 📚 Cursos

### GET `/cursos`
Lista todos os cursos.

**Response (200 OK):**
```json
[
  {
    "codigo": "ADS",
    "nome": "Análise e Desenvolvimento de Sistemas",
    "disciplinas": ["ALG", "LP"]
  },
  {
    "codigo": "MKT",
    "nome": "Marketing",
    "disciplinas": ["MKT_DIGITAL", "ESTRATEGIA"]
  }
]
```

---

### GET `/cursos/:codigo`
Busca um curso específico por código.

**Response (200 OK):**
```json
{
  "codigo": "ADS",
  "nome": "Análise e Desenvolvimento de Sistemas",
  "disciplinas": ["ALG", "LP"]
}
```

---

### POST `/cursos`
Cria um novo curso.

**Request Body:**
```json
{
  "codigo": "ADM",
  "nome": "Administração",
  "disciplinas": ["GESTAO", "FINANCAS"]
}
```

**Campos obrigatórios:**
- `codigo` (string - único, letras maiúsculas, sem espaços)
- `nome` (string - nome completo do curso)
- `disciplinas` (array de strings - códigos das disciplinas)

**Observação:** O código é gerado automaticamente a partir do nome se não fornecido.

---

### PUT `/cursos/:codigo`
Atualiza um curso.

**Request Body:**
```json
{
  "nome": "Análise e Desenvolvimento de Sistemas - Noturno",
  "disciplinas": ["ALG", "LP", "BD"]
}
```

---

## 📖 Disciplinas

### GET `/disciplinas`
Lista todas as disciplinas.

**Response (200 OK):**
```json
[
  {
    "codigo": "ALG",
    "nome": "Algoritmos",
    "carga_horaria": 60
  },
  {
    "codigo": "LP",
    "nome": "Linguagem de Programação",
    "carga_horaria": 60
  }
]
```

---

### GET `/disciplinas/:codigo`
Busca uma disciplina específica por código.

**Response (200 OK):**
```json
{
  "codigo": "ALG",
  "nome": "Algoritmos",
  "carga_horaria": 60
}
```

---

### POST `/disciplinas`
Cria uma nova disciplina.

**Request Body:**
```json
{
  "codigo": "BD",
  "nome": "Banco de Dados",
  "carga_horaria": 80
}
```

**Campos obrigatórios:**
- `codigo` (string - único, gerado automaticamente do nome se omitido)
- `nome` (string)
- `carga_horaria` (number - em horas)

---

### PUT `/disciplinas/:codigo`
Atualiza uma disciplina.

**Request Body:**
```json
{
  "nome": "Banco de Dados Relacionais",
  "carga_horaria": 100
}
```

---

## 📝 Notas

### GET `/notas`
Lista todas as notas ou filtra por código da disciplina.

**Query Parameters (opcionais):**
- `disciplina_codigo` - Filtrar por código da disciplina

**Response (200 OK):**
```json
[
  {
    "id": "11111111111_ALG",
    "cpf": "11111111111",
    "disciplina": "Algoritmos",
    "disciplina_codigo": "ALG",
    "nota": 8.5,
    "criadoEm": "2025-11-10T12:00:00.000Z"
  }
]
```

**Observações:**
- Sempre retorna um **array** (mesmo que vazio)
- Para buscar todas as notas de um aluno, use `GET /notas/aluno/:cpf`
- Para buscar uma nota específica (aluno + disciplina), use `GET /notas/:id`

---

### GET `/notas/aluno/:cpf`
Busca todas as notas de um aluno específico por CPF.

**Path Parameters:**
- `cpf` - CPF do aluno (11 dígitos, apenas números)

**Response (200 OK):**
```json
[
  {
    "id": "11111111111_ALG",
    "cpf": "11111111111",
    "disciplina": "Algoritmos",
    "disciplina_codigo": "ALG",
    "nota": 8.5,
    "criadoEm": "2025-11-10T12:00:00.000Z"
  },
  {
    "id": "11111111111_LP",
    "cpf": "11111111111",
    "disciplina": "Linguagem de Programação",
    "disciplina_codigo": "LP",
    "nota": 9.0,
    "criadoEm": "2025-11-10T12:00:00.000Z"
  }
]
```

**Observações:**
- Sempre retorna um **array** (mesmo que vazio, se o aluno não tiver notas)
- Array vazio não é erro 404, pois o aluno pode existir mas não ter notas lançadas

---

### GET `/notas/:id`
Busca uma nota específica por ID (combinação de CPF + código da disciplina).

**Path Parameters:**
- `id` - ID da nota no formato `{cpf}_{codigo_disciplina}` (ex: `11111111111_ALG`)

**Response (200 OK):**
```json
{
  "id": "11111111111_ALG",
  "cpf": "11111111111",
  "disciplina": "Algoritmos",
  "disciplina_codigo": "ALG",
  "nota": 8.5,
  "criadoEm": "2025-11-10T12:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Nota não encontrada"
}
```

---

### POST `/notas`
Cria um novo lançamento de nota.

**Request Body:**
```json
{
  "cpf": "11111111111",
  "disciplina": "Algoritmos",
  "disciplina_codigo": "ALG",
  "nota": 8.5
}
```

**Campos obrigatórios:**
- `cpf` (string - CPF do aluno)
- `disciplina` (string - nome da disciplina)
- `nota` (number - valor entre 0 e 10)

**Campos opcionais:**
- `id` (string - gerado automaticamente se omitido: `{cpf}_{disciplina_codigo}`)
- `disciplina_codigo` (string - gerado do nome da disciplina se omitido)
- `descricao` ou `observacao` (string - comentários sobre a nota)

**Response (201 Created):**
```json
{
  "id": "11111111111_ALG",
  "cpf": "11111111111",
  "disciplina": "Algoritmos",
  "disciplina_codigo": "ALG",
  "nota": 8.5,
  "criadoEm": "2025-11-10T12:00:00.000Z"
}
```

**Validações:**
- Nota deve estar entre 0 e 10
- CPF deve existir na base de usuários/alunos
- Disciplina deve existir na base de disciplinas

---

## 🗂️ Estrutura do Banco de Dados

### Coleções/Tabelas Necessárias

#### 1. **usuarios**
```sql
CREATE TABLE usuarios (
  cpf VARCHAR(11) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  senha VARCHAR(255) NOT NULL,  -- hash bcrypt
  tipo_conta ENUM('aluno', 'docente', 'funcionario', 'gerente') NOT NULL,
  tipo_conta_id TINYINT NOT NULL,  -- 1=aluno, 2=docente, 3=funcionario, 4=gerente
  -- Campos específicos de aluno
  curso VARCHAR(100),
  situacao ENUM('Ativo', 'Inativo'),
  -- Campos específicos de docente
  grau_academico VARCHAR(100),
  disciplina VARCHAR(255),
  carga_horaria INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (
    (tipo_conta = 'aluno' AND tipo_conta_id = 1) OR
    (tipo_conta = 'docente' AND tipo_conta_id = 2) OR
    (tipo_conta = 'funcionario' AND tipo_conta_id = 3) OR
    (tipo_conta = 'gerente' AND tipo_conta_id = 4)
  )
);
```

#### 2. **alunos** (visão ou tabela auxiliar)
```sql
CREATE TABLE alunos (
  cpf VARCHAR(11) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  curso VARCHAR(100),
  situacao ENUM('Ativo', 'Inativo'),
  FOREIGN KEY (cpf) REFERENCES usuarios(cpf) ON DELETE CASCADE
);
```

#### 3. **docentes** (visão ou tabela auxiliar)
```sql
CREATE TABLE docentes (
  cpf VARCHAR(11) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  grau_academico VARCHAR(100),
  disciplina VARCHAR(255),
  carga_horaria INT,
  FOREIGN KEY (cpf) REFERENCES usuarios(cpf) ON DELETE CASCADE
);
```

#### 4. **fornecedores**
```sql
CREATE TABLE fornecedores (
  cnpj VARCHAR(14) PRIMARY KEY,
  razao_social VARCHAR(255) NOT NULL,
  contatos JSON NOT NULL,  -- array de strings
  servicos JSON NOT NULL,  -- array de strings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 5. **cursos**
```sql
CREATE TABLE cursos (
  codigo VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(255) UNIQUE NOT NULL,
  disciplinas JSON,  -- array de códigos
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 6. **disciplinas**
```sql
CREATE TABLE disciplinas (
  codigo VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(255) UNIQUE NOT NULL,
  carga_horaria INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 7. **notas**
```sql
CREATE TABLE notas (
  id VARCHAR(100) PRIMARY KEY,  -- formato: {cpf}_{disciplina_codigo}
  cpf VARCHAR(11) NOT NULL,
  disciplina VARCHAR(255) NOT NULL,
  disciplina_codigo VARCHAR(50) NOT NULL,
  nota DECIMAL(4,2) NOT NULL CHECK (nota >= 0 AND nota <= 10),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cpf) REFERENCES usuarios(cpf) ON DELETE CASCADE,
  FOREIGN KEY (disciplina_codigo) REFERENCES disciplinas(codigo)
);
```

---

## 🔒 Regras de Negócio e Permissões

### Controle de Acesso por Tipo de Conta

#### **Aluno** (`tipo_conta: 'aluno'`)
- ✅ Ver suas próprias notas (GET `/notas?cpf={seu_cpf}`)
- ✅ Atualizar seus próprios dados cadastrais (PUT `/usuarios/:cpf`)
- ❌ Não pode criar/editar/excluir outros usuários
- ❌ Não pode criar/editar notas

#### **Docente** (`tipo_conta: 'docente'`)
- ✅ Ver suas próprias informações
- ✅ Atualizar seus próprios dados
- ✅ Lançar notas (POST `/notas`)
- ✅ Ver notas de todos os alunos (GET `/notas`)
- ❌ Não pode criar/editar usuários
- ❌ Não pode gerenciar fornecedores

#### **Funcionário** (`tipo_conta: 'funcionario'`)
- ✅ Criar/editar/excluir alunos
- ✅ Criar/editar/excluir docentes
- ✅ Criar/editar/excluir fornecedores
- ✅ Ver todos os dados
- ❌ Não pode criar funcionários/gerentes

#### **Gerente** (`tipo_conta: 'gerente'`)
- ✅ Acesso total a todas as operações
- ✅ Criar/editar/excluir qualquer tipo de usuário
- ✅ Gerenciar cursos, disciplinas, notas
- ✅ Visualizar relatórios gerenciais

---

## 🛡️ Headers de Autenticação

Para rotas protegidas, incluir:

```http
Authorization: Bearer {token_jwt}
Content-Type: application/json
```

---

## ⚠️ Códigos de Status HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Requisição bem-sucedida (GET, PUT, DELETE) |
| 201 | Created | Recurso criado (POST) |
| 400 | Bad Request | Dados inválidos ou faltando campos obrigatórios |
| 401 | Unauthorized | Credenciais inválidas ou token expirado |
| 403 | Forbidden | Usuário não tem permissão para esta ação |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Registro duplicado (CPF/CNPJ/código já existe) |
| 500 | Internal Server Error | Erro no servidor |

---

## 🔧 Validações Importantes

### CPF
- 11 dígitos numéricos
- Sem formatação (apenas números)
- Validação de dígitos verificadores (recomendado)

### CNPJ
- 14 dígitos numéricos
- Sem formatação (apenas números)
- Validação de dígitos verificadores (recomendado)

### Email
- Formato válido (regex)
- Único no sistema

### Nota
- Valor numérico entre 0 e 10
- Pode aceitar até 2 casas decimais

### Tipo de Conta (tipo_conta_id)
Mapeamento entre texto e ID numérico:

| ID | Tipo | Descrição |
|----|------|-----------|
| 1 | aluno | Estudante matriculado |
| 2 | docente | Professor/Instrutor |
| 3 | funcionario | Funcionário administrativo |
| 4 | gerente | Gestor com acesso total |

**Observação:** O `tipo_conta_id` é gerado automaticamente pelo backend com base no valor de `tipo_conta`. Ambos os campos devem ser consistentes.

### Senha
- Mínimo 6 caracteres
- Armazenar como hash bcrypt
- Nunca retornar nos endpoints

---

## 📊 Dados Iniciais (Seed)

```json
{
  "usuarios": [
    { "cpf": "11111111111", "nome": "Aluno Teste", "email": "aluno@teste.com", "telefone": "0000-0001", "tipo_conta": "aluno", "tipo_conta_id": 1, "senha": "$2b$10$hashedpassword", "curso": "ADS", "situacao": "Ativo" },
    { "cpf": "22222222222", "nome": "Docente Teste", "email": "docente@teste.com", "telefone": "0000-0002", "tipo_conta": "docente", "tipo_conta_id": 2, "senha": "$2b$10$hashedpassword" },
    { "cpf": "33333333333", "nome": "Funcionario Teste", "email": "func@teste.com", "telefone": "0000-0003", "tipo_conta": "funcionario", "tipo_conta_id": 3, "senha": "$2b$10$hashedpassword" },
    { "cpf": "44444444444", "nome": "Gerente Teste", "email": "gerente@teste.com", "telefone": "0000-0004", "tipo_conta": "gerente", "tipo_conta_id": 4, "senha": "$2b$10$hashedpassword" }
  ],
  "cursos": [
    { "codigo": "ADS", "nome": "Análise e Desenvolvimento de Sistemas", "disciplinas": ["ALG", "LP"] },
    { "codigo": "MKT", "nome": "Marketing", "disciplinas": [] },
    { "codigo": "ADM", "nome": "Administração", "disciplinas": [] }
  ],
  "disciplinas": [
    { "codigo": "ALG", "nome": "Algoritmos", "carga_horaria": 60 },
    { "codigo": "LP", "nome": "Linguagem de Programação", "carga_horaria": 60 }
  ]
}
```

**Senha padrão para todos**: `senha123`

---

## 🚀 Sugestões de Stack Tecnológica

### Backend
- **Node.js** com **Express.js** (já mencionado no README)
- **TypeScript** (opcional, para maior segurança de tipos)
- **Banco de Dados**: 
  - PostgreSQL ou MySQL (relacional)
  - MongoDB (NoSQL, se preferir)
- **ORM**: Prisma, TypeORM ou Sequelize
- **Autenticação**: JWT (jsonwebtoken)
- **Hash de senha**: bcrypt
- **Validação**: Joi ou Zod

### Estrutura Sugerida
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── usuariosController.ts
│   │   ├── alunosController.ts
│   │   ├── docentesController.ts
│   │   ├── fornecedoresController.ts
│   │   ├── cursosController.ts
│   │   ├── disciplinasController.ts
│   │   └── notasController.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── models/
│   │   ├── Usuario.ts
│   │   ├── Aluno.ts
│   │   ├── Docente.ts
│   │   ├── Fornecedor.ts
│   │   ├── Curso.ts
│   │   ├── Disciplina.ts
│   │   └── Nota.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── usuarios.routes.ts
│   │   ├── alunos.routes.ts
│   │   ├── docentes.routes.ts
│   │   ├── fornecedores.routes.ts
│   │   ├── cursos.routes.ts
│   │   ├── disciplinas.routes.ts
│   │   └── notas.routes.ts
│   ├── services/
│   │   └── (lógica de negócio)
│   ├── utils/
│   │   ├── validators.ts
│   │   └── helpers.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

---

## 📝 Notas Finais

- Todos os endpoints (exceto `/auth/login`) devem exigir autenticação via JWT
- Implementar rate limiting para segurança
- Logs de auditoria para ações críticas (criar/editar/excluir)
- Backup automático do banco de dados
- Documentação com Swagger/OpenAPI (recomendado)
- Testes unitários e de integração

---

**Criado em:** 10/11/2025  
**Versão:** 1.0  
**Projeto:** UniNew - Sistema de Gerenciamento Acadêmico
