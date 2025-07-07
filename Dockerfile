# ---------- Backend ----------
FROM node:18 AS backend-build
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend
WORKDIR /app/backend
RUN npm run build

# ---------- Frontend ----------
FROM node:18 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

# ---------- Test Runtime ----------
FROM node:18 AS test
WORKDIR /app
COPY --from=backend-build /app/backend ./backend
COPY --from=frontend-build /app/frontend ./frontend
# Instala wait-on globalmente para sincronização dos testes
RUN npm install -g wait-on

# ---------- Backend Runtime ----------
FROM node:18 AS backend
WORKDIR /app
COPY --from=backend-build /app/backend ./
ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "dist/main.js"]

# ---------- Frontend Runtime ----------
FROM nginx:alpine AS frontend
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80