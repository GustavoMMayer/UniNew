# 🐳 Docker - UniNew Backend

Guia completo para executar o projeto UniNew usando Docker e Docker Compose.

## 📋 Pré-requisitos

- **Docker** instalado ([Download](https://www.docker.com/products/docker-desktop/))
- **Docker Compose** (já incluído no Docker Desktop)

## 🚀 Como executar

### 1️⃣ Primeira execução (Build e Start)

```bash
# Na raiz do projeto (onde está o docker-compose.yml)
docker-compose up --build
```

### 2️⃣ Execuções seguintes

```bash
# Iniciar containers
docker-compose up

# Ou em background (detached mode)
docker-compose up -d
```

### 3️⃣ Parar os containers

```bash
# Parar containers
docker-compose down

# Parar e remover volumes (apaga dados do banco!)
docker-compose down -v
```

## 🏗️ Estrutura dos Containers

### Container: `uninew-mysql`
- **Imagem**: MySQL 8.0
- **Porta**: 3306 (host) → 3306 (container)
- **Credenciais**:
  - Root: `root` / `root123`
  - User: `uninew_user` / `uninew_pass`
  - Database: `uninew_db`

### Container: `uninew-backend`
- **Imagem**: Node.js 18 Alpine
- **Porta**: 3000 (host) → 3000 (container)
- **URL**: http://localhost:3000/api

## 📊 Acessar o MySQL

### Via Docker Exec

```bash
docker exec -it uninew-mysql mysql -u uninew_user -p
# Senha: uninew_pass
```

### Via MySQL Workbench ou DBeaver

- **Host**: localhost
- **Port**: 3306
- **User**: uninew_user
- **Password**: uninew_pass
- **Database**: uninew_db

## 🔄 Comandos úteis

### Ver logs dos containers

```bash
# Todos os containers
docker-compose logs

# Apenas backend
docker-compose logs backend

# Apenas MySQL
docker-compose logs mysql

# Seguir logs em tempo real
docker-compose logs -f backend
```

### Reiniciar um serviço específico

```bash
# Reiniciar apenas o backend
docker-compose restart backend

# Reiniciar apenas o MySQL
docker-compose restart mysql
```

### Reconstruir imagens

```bash
# Reconstruir tudo
docker-compose up --build

# Reconstruir apenas o backend
docker-compose up --build backend
```

### Ver containers em execução

```bash
docker-compose ps
```

### Executar comandos dentro do container

```bash
# Bash no backend
docker exec -it uninew-backend sh

# Bash no MySQL
docker exec -it uninew-mysql bash
```

### Limpar tudo (cuidado!)

```bash
# Parar e remover containers, networks e volumes
docker-compose down -v

# Remover imagens também
docker-compose down -v --rmi all
```

## 📁 Volumes

Os dados do MySQL são persistidos em um volume Docker chamado `mysql_data`. Isso significa que:

- ✅ Os dados **NÃO** são perdidos quando você para os containers
- ✅ Os dados **persistem** entre reinicializações
- ❌ Os dados **SÃO APAGADOS** se você usar `docker-compose down -v`

## 🔧 Desenvolvimento

### Hot Reload

O código do backend é sincronizado automaticamente entre o host e o container através de volumes. Qualquer alteração no código irá:

1. Ser detectada pelo `nodemon`
2. Reiniciar automaticamente o servidor
3. Refletir imediatamente na aplicação

### Instalar novas dependências

```bash
# Opção 1: Instalar no host e rebuild
npm install --prefix backend nova-dependencia
docker-compose up --build backend

# Opção 2: Instalar dentro do container
docker exec -it uninew-backend npm install nova-dependencia
docker-compose restart backend
```

## 🗄️ Banco de Dados

### Schema inicial

O arquivo `database/init.sql` cria:

- ✅ Tabelas: usuarios, fornecedores, cursos, disciplinas, notas
- ✅ Dados seed (usuários de teste, cursos, disciplinas)
- ✅ Índices para performance

### Dados de teste

| Tipo | CPF | Email | Senha |
|------|-----|-------|-------|
| Aluno | 11111111111 | aluno@teste.com | senha123 |
| Docente | 22222222222 | docente@teste.com | senha123 |
| Funcionário | 33333333333 | func@teste.com | senha123 |
| Gerente | 44444444444 | gerente@teste.com | senha123 |

### Resetar banco de dados

```bash
# Parar containers e remover volumes
docker-compose down -v

# Subir novamente (recria o banco)
docker-compose up
```

## 🌐 Testar a API

### Usando cURL

```bash
# Health check
curl http://localhost:3000/api

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"aluno@teste.com","password":"senha123"}'
```

### Usando Postman/Insomnia

Importe a collection ou crie requests para:
- Base URL: `http://localhost:3000/api`
- Endpoints documentados em `backend-api-documentation.md`

## ⚠️ Troubleshooting

### Porta 3000 já em uso

```bash
# Parar processo na porta 3000 (Windows PowerShell)
$processId = (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id $processId -Force

# Ou alterar a porta no docker-compose.yml
ports:
  - "3001:3000"  # usa porta 3001 no host
```

### Porta 3306 já em uso (MySQL local)

```bash
# Opção 1: Parar MySQL local
# Windows: Services → MySQL → Stop

# Opção 2: Usar outra porta no docker-compose.yml
ports:
  - "3307:3306"  # usa porta 3307 no host
```

### Container do backend não conecta ao MySQL

```bash
# Verificar se o MySQL está healthy
docker-compose ps

# Ver logs do MySQL
docker-compose logs mysql

# Aguardar alguns segundos (healthcheck pode levar tempo)
```

### Erro de permissão no Windows

Execute o PowerShell ou CMD como **Administrador**.

## 📝 Variáveis de Ambiente

As variáveis são definidas no `docker-compose.yml` e sobrescrevem o `.env`:

```yaml
environment:
  NODE_ENV: development
  PORT: 3000
  DB_HOST: mysql  # Nome do serviço no docker-compose
  DB_PORT: 3306
  DB_USER: uninew_user
  DB_PASSWORD: uninew_pass
  DB_NAME: uninew_db
  JWT_SECRET: seu_jwt_secret_aqui
  JWT_EXPIRES_IN: 24h
```

## 🎯 Próximos passos

1. ✅ Containers configurados
2. ✅ Banco de dados criado
3. ⏳ Implementar controllers com MySQL
4. ⏳ Adicionar validações Joi
5. ⏳ Implementar autenticação JWT
6. ⏳ Testes de integração

---

**Dúvidas?** Consulte a documentação completa da API em `backend-api-documentation.md`
