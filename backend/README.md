# UniNew Backend API

API REST para o sistema de gerenciamento acadêmico UniNew.

## 🚀 Tecnologias

- **Node.js** 18 (Alpine)
- **Express.js** - Framework web
- **MySQL** 8.0 - Banco de dados
- **Joi** - Validação de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Docker** - Containerização

---

## 🐳 Executar com Docker (Recomendado)

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado

### Iniciar o projeto

```bash
# Na raiz do projeto (onde está o docker-compose.yml)
docker-compose up --build
```

### Comandos úteis

```bash
# Iniciar containers
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f backend

# Resetar banco de dados (apaga todos os dados!)
docker-compose down -v
docker-compose up
```

### Acessar a aplicação

- **Backend API**: http://localhost:3000/api
- **MySQL**: localhost:3306
  - User: `uninew_user`
  - Password: `uninew_pass`
  - Database: `uninew_db`

---

## 💻 Executar sem Docker (Desenvolvimento Local)

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar MySQL

Crie o banco de dados:

```sql
CREATE DATABASE uninew_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Execute o script de criação de tabelas:

```bash
mysql -u root -p uninew_db < ../database/init.sql
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
NODE_ENV=development

JWT_SECRET=seu_jwt_secret_aqui_mude_em_producao
JWT_EXPIRES_IN=24h

DB_HOST=localhost
DB_PORT=3306
DB_USER=uninew_user
DB_PASSWORD=uninew_pass
DB_NAME=uninew_db
```

### 4. Executar

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

---

## 📚 Documentação da API

Consulte o arquivo [`backend-api-documentation.md`](../backend-api-documentation.md) na raiz do projeto para detalhes completos dos endpoints.

**Base URL**: `http://localhost:3000/api`

### Endpoints disponíveis

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/usuarios` - Listar usuários
- `GET /api/alunos` - Listar alunos
- `GET /api/docentes` - Listar docentes
- `GET /api/fornecedores` - Listar fornecedores
- `GET /api/cursos` - Listar cursos
- `GET /api/disciplinas` - Listar disciplinas
- `GET /api/notas` - Listar notas

**Total**: 32 rotas mapeadas

---

## 🗄️ Banco de Dados

### Tabelas

- `usuarios` - Usuários do sistema (alunos, docentes, funcionários, gerentes)
- `fornecedores` - Fornecedores de serviços
- `cursos` - Cursos oferecidos
- `disciplinas` - Disciplinas dos cursos
- `notas` - Notas dos alunos

### Dados de Teste (Seed)

| Tipo | CPF | Email | Senha |
|------|-----|-------|-------|
| Aluno | 11111111111 | aluno@teste.com | senha123 |
| Docente | 22222222222 | docente@teste.com | senha123 |
| Funcionário | 33333333333 | func@teste.com | senha123 |
| Gerente | 44444444444 | gerente@teste.com | senha123 |

---

## 🔑 Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```http
Authorization: Bearer {seu_token}
```

### Exemplo de Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"aluno@teste.com","password":"senha123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "cpf": "11111111111",
    "nome": "Aluno Teste",
    "email": "aluno@teste.com",
    "tipo_conta": "aluno",
    "tipo_conta_id": 1
  }
}
```

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Configuração MySQL
│   │   └── jwt.js           # Configuração JWT
│   ├── controllers/         # Lógica dos endpoints (8 controllers)
│   │   ├── auth.controller.js
│   │   ├── usuarios.controller.js
│   │   ├── alunos.controller.js
│   │   ├── docentes.controller.js
│   │   ├── fornecedores.controller.js
│   │   ├── cursos.controller.js
│   │   ├── disciplinas.controller.js
│   │   └── notas.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js        # Verificação JWT
│   │   └── validation.middleware.js  # Validação Joi
│   ├── routes/              # Definição das rotas (8 arquivos)
│   ├── validators/          # Schemas Joi
│   ├── mocks/              # Dados mockados
│   │   └── data.js
│   └── server.js           # Arquivo principal
├── Dockerfile              # Imagem Docker do backend
├── .dockerignore
├── package.json
└── .env
```

---

## 🔧 Troubleshooting

### Porta 3000 já em uso

**Windows PowerShell:**
```powershell
$processId = (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id $processId -Force
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Erro de conexão com MySQL

Verifique se o MySQL está rodando:

```bash
# Docker
docker-compose ps

# Local
# Windows: Services → MySQL → Start
# Linux: sudo systemctl start mysql
```

### Resetar banco de dados

```bash
# Com Docker
docker-compose down -v
docker-compose up

# Sem Docker
mysql -u root -p -e "DROP DATABASE IF EXISTS uninew_db; CREATE DATABASE uninew_db;"
mysql -u root -p uninew_db < ../database/init.sql
```

---

## 📊 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente | development |
| `JWT_SECRET` | Chave secreta JWT | - |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | 24h |
| `DB_HOST` | Host do MySQL | localhost |
| `DB_PORT` | Porta do MySQL | 3306 |
| `DB_USER` | Usuário do MySQL | uninew_user |
| `DB_PASSWORD` | Senha do MySQL | uninew_pass |
| `DB_NAME` | Nome do banco | uninew_db |

---

## 📝 Próximos Passos

- [x] Estrutura de rotas criada
- [x] Configuração Docker
- [x] Banco de dados MySQL
- [ ] Implementar controllers com MySQL
- [ ] Adicionar validações Joi completas
- [ ] Implementar autenticação JWT
- [ ] Adicionar testes unitários
- [ ] Documentação Swagger/OpenAPI

---

## 📖 Documentação Adicional

- [Documentação Completa da API](../backend-api-documentation.md)
- [Guia Docker](../README-DOCKER.md)

---

**Desenvolvido para o projeto UniNew - Sistema de Gerenciamento Acadêmico**
