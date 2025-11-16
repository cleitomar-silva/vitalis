# Etapa 1 - Build
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Porta padrão do React (ou do Vite, se for o caso)
EXPOSE 3000

CMD ["npm", "start"]
