# Testes E2E - UniNew API

Testes End-to-End para validar os endpoints da API.

## 📋 Requisitos

- Node.js 18+
- Docker e Docker Compose (para rodar a aplicação)
- npm ou yarn

## 🚀 Como executar

1. **Instalar dependências:**
```bash
cd tests-e2e
npm install
```

2. **Garantir que a API está rodando:**
```bash
# Na raiz do projeto
docker-compose up -d
```

3. **Executar os testes:**
```bash
npm test
```

4. **Executar testes específicos:**
```bash
npm test -- cursos.test.js
npm test -- auth.test.js
```

## 📁 Estrutura

```
tests-e2e/
├── package.json
├── README.md
├── config/
│   └── test.config.js
├── helpers/
│   └── api.helper.js
└── tests/
    ├── cursos.test.js
    ├── disciplinas.test.js
    ├── usuarios.test.js
    └── auth.test.js
```

## 🔧 Configuração

Os testes apontam por padrão para `http://localhost:3000/api`.
Para alterar, edite o arquivo `config/test.config.js`.

## ⚠️ Nota Importante

Estes testes **não fazem parte do código principal** da aplicação.
São usados apenas para validação manual e não devem ser incluídos no repositório principal.
