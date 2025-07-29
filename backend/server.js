// server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import sitemapRoutes from './routes/sitemapRoutes.js';

import storiesRoutes from './routes/storiesRoutes.js';

dotenv.config();

/* global process, console */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/sitemap.xml', sitemapRoutes);
app.use('/stories', express.static(path.join(__dirname, 'stories')));
app.use('/api/stories', storiesRoutes);

// Conexão com MongoDB + inicialização do servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));
