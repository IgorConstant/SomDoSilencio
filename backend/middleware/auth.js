import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* global process */
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('email _id');
    if (!user) return res.sendStatus(401);
    req.user = { id: user._id, email: user.email };
    next();
  } catch {
    res.sendStatus(403);
  }
};