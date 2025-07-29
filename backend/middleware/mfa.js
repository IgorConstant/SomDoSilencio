import speakeasy from 'speakeasy';
import dotenv from 'dotenv';
dotenv.config();

export const verifyMFA = (req, res, next) => {
  let { token, secret } = req.body;
  // Se não vier secret no body, usa o do .env
  if (!secret) {
    secret = process.env.MFA_SECRET;
  }
/* global process */
  const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token });
  if (!verified) return res.status(401).json({ error: 'Invalid MFA token' });
  next();
};