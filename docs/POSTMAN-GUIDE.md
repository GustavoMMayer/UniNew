# 📮 Postman Collection - UniNew API

## 📥 Como Importar

### 1. Importar a Collection

1. Abra o Postman
2. Clique em **"Import"** (canto superior esquerdo)
3. Selecione o arquivo `UniNew-API.postman_collection.json`
4. Clique em **"Import"**

### 2. Importar o Environment (opcional, mas recomendado)

1. No Postman, clique no ícone de engrenagem ⚙️ (Settings) no canto superior direito
2. Vá em **"Environments"**
3. Clique em **"Import"**
4. Selecione o arquivo `UniNew-DEV.postman_environment.json`
5. Selecione o environment **"UniNew - Development"** no dropdown no canto superior direito

---

## 📂 Estrutura da Collection

A collection está organizada em **9 pastas**:

### 1. **Auth** (3 requisições)
- Login com CPF
- Login com Email
- Logout

### 2. **Usuários** (8 requisições)
- Listar todos
- Listar com filtros
- Buscar por CPF
- Buscar por Email
- Criar Aluno
- Criar Docente
- Atualizar
- Deletar

### 3. **Alunos** (5 requisições)
- Listar todos
- Filtrar por curso
- Filtrar por situação
- Buscar por CPF
- Atualizar

### 4. **Docentes** (3 requisições)
- Listar todos
- Buscar por CPF
- Atualizar

### 5. **Fornecedores** (5 requisições)
- Listar todos
- Buscar por CNPJ
- Criar
- Atualizar
- Deletar

### 6. **Cursos** (5 requisições)
- Listar todos
- Buscar por código
- Criar (com código)
- Criar (código auto-gerado)
- Atualizar

### 7. **Disciplinas** (5 requisições)
- Listar todos
- Buscar por código
- Criar (com código)
- Criar (código auto-gerado)
- Atualizar

### 8. **Notas** (6 requisições)
- Listar todas
- Filtrar por disciplina
- Listar por aluno
- Buscar por ID
- Criar (completo)
- Criar (auto-gerado)

### 9. **Testes de Validação** (5 requisições)
- Login com senha curta (erro esperado)
- Usuário com CPF inválido (erro esperado)
- Nota maior que 10 (erro esperado)
- Filtro com curso inválido (erro esperado)
- Fornecedor com CNPJ inválido (erro esperado)

---

## 🔑 Autenticação Automática

### Como funciona:

1. Execute a requisição **"Login com CPF"** ou **"Login com Email"** da pasta **Auth**
2. O token JWT é **automaticamente salvo** na variável `{{auth_token}}`
3. Todas as requisições que precisam de autenticação já estão configuradas para usar essa variável
4. Não precisa copiar/colar o token manualmente! 🎉

### Script de Auto-Save (já configurado):

As requisições de login têm um script de teste que executa automaticamente:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set('auth_token', response.token);
    pm.environment.set('user_cpf', response.usuario.cpf);
    pm.environment.set('user_tipo_conta', response.usuario.tipo_conta);
}
```

---

## 📋 Variáveis de Environment

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `base_url` | URL base da API | `http://localhost:3000/api` |
| `auth_token` | Token JWT (auto-preenchido) | - |
| `user_cpf` | CPF do usuário logado | - |
| `user_tipo_conta` | Tipo de conta do usuário | - |

---

## 🚀 Guia de Uso Rápido

### 1️⃣ Iniciar o Backend

```bash
cd backend
npm install
npm run dev
```

Ou com Docker:

```bash
docker-compose up
```

### 2️⃣ Fazer Login

1. Abra a pasta **"Auth"**
2. Execute **"Login com CPF"** ou **"Login com Email"**
3. Verifique que o status é **200 OK**
4. O token é salvo automaticamente! ✅

### 3️⃣ Testar Endpoints

Agora você pode executar qualquer endpoint que requer autenticação:

- ✅ Criar usuários
- ✅ Criar fornecedores
- ✅ Lançar notas
- ✅ Gerenciar cursos e disciplinas

### 4️⃣ Testar Validações

Execute as requisições da pasta **"Testes de Validação"** para ver as validações Joi em ação:

- Espera-se **status 400** (Bad Request)
- Corpo da resposta mostra os erros de validação

---

## 📝 Exemplos de Fluxo Completo

### Fluxo 1: Cadastrar Novo Aluno

1. **Auth > Login com Email** (usar credenciais de gerente/funcionário)
2. **Usuários > Criar Usuário Aluno**
3. **Alunos > Buscar Aluno por CPF** (verificar se foi criado)
4. **Alunos > Atualizar Aluno** (mudar curso ou situação)

### Fluxo 2: Lançar Notas de um Aluno

1. **Auth > Login com Email** (usar credenciais de docente)
2. **Notas > Listar Notas de um Aluno** (verificar notas existentes)
3. **Notas > Criar Nota** (lançar nova nota)
4. **Notas > Listar Notas de um Aluno** (verificar nota lançada)

### Fluxo 3: Gerenciar Cursos

1. **Auth > Login com Email** (usar credenciais de gerente)
2. **Cursos > Listar Todos os Cursos**
3. **Disciplinas > Criar Disciplina**
4. **Cursos > Criar Curso** (vinculando disciplinas)
5. **Cursos > Atualizar Curso** (adicionar mais disciplinas)

---

## 🧪 Testando Validações Joi

### Exemplo 1: CPF Inválido

**Request:**
```json
POST /api/usuarios
{
  "cpf": "123",
  "nome": "Teste",
  "email": "teste@teste.com",
  "senha": "senha123",
  "tipo_conta": "aluno"
}
```

**Response (400):**
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

### Exemplo 2: Nota Fora do Intervalo

**Request:**
```json
POST /api/notas
{
  "cpf": "11111111111",
  "disciplina": "Algoritmos",
  "nota": 15.5
}
```

**Response (400):**
```json
{
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "nota",
      "message": "Nota deve ser entre 0 e 10"
    }
  ]
}
```

---

## 🔐 Credenciais de Teste

### Dados Iniciais (Seed Data)

| Tipo | CPF | Email | Senha | tipo_conta_id |
|------|-----|-------|-------|---------------|
| Aluno | 11111111111 | aluno@teste.com | senha123 | 1 |
| Docente | 22222222222 | docente@teste.com | senha123 | 2 |
| Funcionário | 33333333333 | func@teste.com | senha123 | 3 |
| Gerente | 44444444444 | gerente@teste.com | senha123 | 4 |

---

## 🎯 Dicas de Uso

### ✅ Usar Variáveis

Em vez de digitar valores fixos, use variáveis:

- `{{base_url}}` - URL base da API
- `{{auth_token}}` - Token de autenticação
- `{{user_cpf}}` - CPF do usuário logado

### ✅ Organização de Testes

1. Execute primeiro os testes de **validação** (pasta "Testes de Validação")
2. Depois teste o **fluxo normal** (criar → listar → atualizar → deletar)
3. Teste **filtros e buscas** específicas

### ✅ Verificar Status Code

- **200** - OK (GET, PUT, DELETE)
- **201** - Created (POST)
- **400** - Bad Request (validação falhou)
- **401** - Unauthorized (token inválido)
- **404** - Not Found (recurso não encontrado)
- **409** - Conflict (CPF/CNPJ duplicado)

### ✅ Ordem de Execução

Para testar a API completa, execute nesta ordem:

1. **Auth > Login** (obter token)
2. **Disciplinas > Criar** (criar disciplinas primeiro)
3. **Cursos > Criar** (criar cursos vinculando disciplinas)
4. **Usuários > Criar Aluno** (criar aluno no curso)
5. **Notas > Criar Nota** (lançar notas para o aluno)
6. **Fornecedores > Criar** (criar fornecedores)

---

## 📊 Endpoints Totais

- **Total de requisições**: 45+
  - Auth: 3
  - Usuários: 8
  - Alunos: 5
  - Docentes: 3
  - Fornecedores: 5
  - Cursos: 5
  - Disciplinas: 5
  - Notas: 6
  - Testes de Validação: 5

---

## 🐛 Troubleshooting

### ❌ "Could not get response"

**Causa:** Backend não está rodando

**Solução:**
```bash
cd backend
npm run dev
```

### ❌ "401 Unauthorized"

**Causa:** Token não foi salvo ou expirou

**Solução:** Execute novamente a requisição de login

### ❌ "404 Not Found"

**Causa:** Rota incorreta ou recurso não existe

**Solução:** Verifique se a URL está correta e se o recurso foi criado

### ❌ "400 Bad Request - Validation Error"

**Causa:** Dados enviados não passaram na validação Joi

**Solução:** Leia os erros retornados e corrija os campos inválidos

---

## 📚 Documentação Adicional

Para mais detalhes sobre a API, consulte:

- `backend-api-documentation.md` - Documentação completa da API
- `VALIDACAO-JOI.md` - Detalhes sobre validações implementadas
- `README.md` - Instruções de setup do backend

---

## 🎉 Pronto para Usar!

Agora você tem uma collection completa do Postman com:

✅ Todos os 32 endpoints documentados
✅ Autenticação automática com JWT
✅ Exemplos de requisições válidas
✅ Testes de validação (casos de erro)
✅ Variáveis de environment configuradas
✅ Scripts de auto-save do token

**Bons testes!** 🚀
