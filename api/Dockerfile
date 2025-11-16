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

# Expõe a porta do servidor Node (ajuste se for diferente)
EXPOSE 8888

# Comando padrão
CMD ["npm", "run", "dev"]
