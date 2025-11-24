# Imagem base do Node.js
FROM node:18-alpine

# Configurar locale e encoding UTF-8
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    NODE_ENV=development

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código fonte
COPY . .

# Expor a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação em desenvolvimento
CMD ["npm", "run", "dev"]
