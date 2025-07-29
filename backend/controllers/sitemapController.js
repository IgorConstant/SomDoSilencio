import Post from '../models/Post.js';

export const generateSitemap = async (req, res) => {
  const posts = await Post.find({ status: 'publicado' });
  const urls = posts.map(p => `<url><loc>https://seusite.com/post/${p.slug}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(xml);
};