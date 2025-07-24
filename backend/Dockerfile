# Dockerfile para o backend (Node.js)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
USER node
CMD ["node", "server.js"]