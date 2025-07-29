// Endpoint para buscar o secret MFA do usuário (apenas para fins de desenvolvimento)
export const getMfaSecret = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.sendStatus(404);
  res.json({ secret: user.mfaSecret });
};
// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import speakeasy from 'speakeasy';
/* global process */

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password) return res.sendStatus(401);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Usuário já existe' });

  const secret = speakeasy.generateSecret({ name: `BlogMúsica (${email})` });
  const user = new User({ email, password, mfaSecret: secret.base32 });
  await user.save();

  res.json({ message: 'Usuário criado com MFA', secret: secret.otpauth_url });
};