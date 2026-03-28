import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await AdminUser.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  } else {
    return res.status(401).json({ message: 'No autorizado, sin token' });
  }
};
