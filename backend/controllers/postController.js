import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  const post = new Post({ ...req.body, image: req.file?.filename });
  await post.save();
  res.json(post);
};

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
};

export const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};