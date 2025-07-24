import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storiesDir = path.join(__dirname, '../stories');

// Rota para listar imagens do diretório stories
router.get('/', (req, res) => {
  fs.readdir(storiesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar imagens.' });
    }
    // Filtra apenas arquivos de imagem (png, jpg, jpeg, webp)
    const images = files.filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file));
    // Monta URLs públicas
    const imageUrls = images.map(file => ({
      name: file,
      url: `/stories/${file}`
    }));
    res.json(imageUrls);
  });
});

export default router;
