import Post from '../models/Post.js';
import he from 'he';

// 🔧 Função para decodificar e limpar <p> ao redor de iframes
const cleanIframeFromHTML = (html) => {
  if (!html) return html;

  // Decodifica &lt; e &gt; para tags reais
  html = he.decode(html);

  // Remove <p> envolvendo <iframe>, com espaços/br/nbsp
  html = html.replace(
    /<p[^>]*>\s*(?:&nbsp;|\s|<br\s*\/?>)*(<iframe[\s\S]*?<\/iframe>)\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/p>/gi,
    '$1'
  );

  return html;
};

export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Aplica limpeza ao content antes de retornar
    const cleanedPost = {
      ...post.toObject(),
      content: cleanIframeFromHTML(post.content),
    };

    res.json(cleanedPost);
  } catch (error) {
    res.status(400).json({ message: 'Slug inválido' });
  }
};

export const createPost = async (req, res) => {
  const body = { ...req.body };

  // Opcional: limpa iframe no momento da criação
  if (body.content) {
    body.content = cleanIframeFromHTML(body.content);
  }

  const post = new Post({ ...body, image: req.file?.filename });
  await post.save();
  res.json(post);
};

export const updatePost = async (req, res) => {
  const body = { ...req.body };

  // Opcional: limpa iframe no momento da atualização
  if (body.content) {
    body.content = cleanIframeFromHTML(body.content);
  }

  const post = await Post.findByIdAndUpdate(req.params.id, body, { new: true });
  res.json(post);
};

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'ID inválido' });
  }
};

export const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
