/* global console */
import Post from "../models/Post.js";
import he from "he";
import generatePostImage from "../services/geradorImagens.js";

// Função para decodificar e limpar <p> ao redor de iframes
const cleanIframeFromHTML = (html) => {
  if (!html) return html;

  // Decodifica &lt; e &gt; para tags reais
  html = he.decode(html);

  // Remove <p> envolvendo <iframe>, com espaços/br/nbsp
  html = html.replace(
    /<p[^>]*>\s*(?:&nbsp;|\s|<br\s*\/?>)*(<iframe[\s\S]*?<\/iframe>)\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/p>/gi,
    "$1"
  );

  return html;
};

export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    // Aplica limpeza ao content antes de retornar
    const cleanedPost = {
      ...post.toObject(),
      content: cleanIframeFromHTML(post.content),
    };

    res.json(cleanedPost);
  } catch {
    res.status(400).json({ message: "Slug inválido" });
  }
};

export const createPost = async (req, res) => {
  try {
    const body = { ...req.body };

    // Limpa iframe do conteúdo
    if (body.content) {
      body.content = cleanIframeFromHTML(body.content);
    }

    // Gera o slug, caso não venha
    const slug =
      body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    body.slug = slug;

    // Salva o post normalmente no banco
    const imageFilename = req.file?.filename;
    const post = new Post({ ...body, image: imageFilename });
    await post.save();

    const imageUrl = await generatePostImage({
      title: body.title,
      intro: body.intro || body.excerpt || "",
      author: body.author || "Igor Henrique Constant",
      readTime: body.readTime || "3 min read",
      slug,
      imageFilename,
    });

    res.json({
      ...post.toObject(),
      shareImage: imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar post." });
  }
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
      return res.status(404).json({ message: "Post não encontrado" });
    }
    res.json(post);
  } catch {
    res.status(400).json({ message: "ID inválido" });
  }
};

export const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
