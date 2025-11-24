# Testes E2E - Auth API

## 📝 Descrição

Testes end-to-end para os endpoints de autenticação da UniNew API.

## 🎯 Endpoints Testados

### POST /api/auth/login
Autenticação de usuário com CPF/email e senha.

**Request:**
```json
{
  "username": "11111111111",  // CPF ou email
  "password": "senha123"
}
```

**Response (200):**
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

### POST /api/auth/logout
Logout do usuário (invalida token).

**Request:**
```json
{}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "ok": true
}
```

## ✅ Casos de Teste

### Login (11 testes)

1. **Login bem-sucedido com CPF**
   - Verifica status 200
   - Verifica presença de token e usuário
   - Garante que senha não é retornada

2. **Login bem-sucedido com email**
   - Testa autenticação com email ao invés de CPF
   - Valida estrutura da resposta

3. **Credenciais inválidas**
   - Senha incorreta → 400
   - Usuário inexistente → 400
   - Mensagem genérica (segurança)

4. **Validações de campos**
   - Username obrigatório
   - Password obrigatório
   - Senha mínima de 6 caracteres

5. **Validação de token JWT**
   - Token tem 3 partes separadas por `.`
   - Formato válido: header.payload.signature

6. **Estrutura do usuário retornado**
   - Campos: cpf, nome, email, tipo_conta
   - Senha NÃO deve estar presente

7. **Segurança**
   - Não expõe informações sensíveis em erros
   - CPF com ou sem pontuação

### Logout (2 testes)

1. **Logout com token válido**
   - Verifica status 200
   - Valida resposta `{ok: true}`

2. **Logout sem token**
   - Permite logout local (frontend)
   - Status 200

### Integração (1 teste)

1. **Acesso a endpoint protegido**
   - Login → obter token
   - Usar token em request autenticado
   - Verifica integração com middleware de auth

### Performance (1 teste)

1. **Tempo de resposta do login**
   - Deve responder em menos de 2 segundos

## 🔐 Segurança

### Boas Práticas Testadas

- ✅ Senha nunca retornada em responses
- ✅ Mensagens de erro genéricas (não expõem se usuário existe)
- ✅ Token JWT com estrutura válida
- ✅ Validação de tamanho mínimo de senha
- ✅ Aceitação de CPF com/sem formatação

### Dados de Teste

**Usuário válido:**
- CPF: `11111111111`
- Email: `aluno@teste.com`
- Senha: `senha123`
- Tipo: `aluno`

## 📊 Execução

### Rodar todos os testes de auth
```bash
npm test -- auth.test.js
```

### Rodar teste específico
```bash
npm test -- auth.test.js -t "Deve fazer login com credenciais válidas"
```

### Rodar com verbose
```bash
npm test -- auth.test.js --verbose
```

## 📈 Cobertura Esperada

- **Total de testes:** 15
- **Cenários de sucesso:** 4
- **Cenários de erro:** 7
- **Validações de segurança:** 2
- **Performance:** 1
- **Integração:** 1

## ⚠️ Pré-requisitos

1. API rodando em `http://localhost:3000`
2. Banco de dados populado com usuário de teste
3. Endpoints de autenticação implementados

## 🔄 Status da Implementação

Atualmente os endpoints de auth estão **parcialmente implementados** (retornam mock data).

**Implementação pendente:**
- [ ] Busca de usuário no banco (usuariosRepository.findForAuth)
- [ ] Validação de senha com bcrypt
- [ ] Geração de token JWT
- [ ] Blacklist de tokens no logout
- [ ] Middleware de autenticação

**Testes que passarão após implementação completa:**
- [x] Estrutura de resposta
- [x] Validações de campos
- [ ] Login com credenciais reais
- [ ] Logout com invalidação de token
- [ ] Acesso a endpoints protegidos

## 🛠️ Troubleshooting

### Erro: "Cannot POST /api/auth/login"
- Verificar se backend está rodando
- Verificar se rota está registrada em `server.js`

### Erro: "Credenciais inválidas" em teste válido
- Verificar se usuário existe no banco
- Confirmar senha no banco (bcrypt hash de "senha123")

### Erro: timeout nos testes
- Aumentar timeout no Jest: `jest.setTimeout(10000)`
- Verificar se API está acessível

## 📚 Referências

- [Jest Documentation](https://jestjs.io/)
- [Axios Documentation](https://axios-http.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
