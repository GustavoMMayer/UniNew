# 📝 Instruções de Uso - Testes E2E

## 🎯 Objetivo

Estes testes servem para **validar manualmente** se os endpoints da API estão funcionando corretamente.

## ⚠️ IMPORTANTE

**ESTES TESTES NÃO FAZEM PARTE DO CÓDIGO PRINCIPAL!**

- Não devem ser commitados no repositório principal
- Servem apenas para validação durante desenvolvimento
- Podem ser descartados após validação

## 🚀 Setup Rápido

### 1. Instalar dependências

```bash
cd tests-e2e
npm install
```

### 2. Garantir que a API está rodando

```bash
# Voltar para raiz do projeto
cd ..

# Subir os containers
docker-compose up -d

# Verificar se está rodando
curl http://localhost:3000/api/cursos
```

### 3. Executar os testes

```bash
cd tests-e2e
npm test
```

## 📊 Interpretando Resultados

### ✅ Teste Passou
```
✓ Deve retornar lista de cursos (45ms)
```
Significa que o endpoint está funcionando corretamente.

### ❌ Teste Falhou
```
✕ Deve retornar lista de cursos (102ms)
  Expected status 200, received 500
```
Significa que há um problema no endpoint. Verifique os logs do backend.

### ⚠️ Teste Pulado (Endpoint não implementado)
Se o endpoint retornar status 500 com "implementação pendente", o teste pode aceitar isso como válido temporariamente.

## 🔍 Debugando Problemas

### API não responde
```bash
# Verificar se containers estão rodando
docker-compose ps

# Ver logs do backend
docker-compose logs backend

# Reiniciar backend
docker-compose restart backend
```

### Encoding UTF-8
Os testes verificam se os acentos estão corretos (ção, não "Ã§Ã£o").

### Performance
Alguns testes verificam se a API responde em menos de 2 segundos.

## 📁 Adicionar Novos Testes

Para adicionar testes de outros endpoints, crie arquivos na pasta `tests/`:

```bash
tests-e2e/tests/
├── cursos.test.js      ✅ Criado
├── disciplinas.test.js  ⬜ Criar se necessário
├── usuarios.test.js     ⬜ Criar se necessário
└── auth.test.js         ⬜ Criar se necessário
```

Use `cursos.test.js` como template.

## 🗑️ Limpeza

Quando não precisar mais dos testes:

```bash
cd ..
rm -rf tests-e2e
```

Ou simplesmente não commite a pasta no Git.
