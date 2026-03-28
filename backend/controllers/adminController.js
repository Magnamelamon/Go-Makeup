import { AdminUser } from '../models/AdminUser.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth admin & get token
// @route   POST /api/admins/login
// @access  Public
export const authAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminUser.findOne({ where: { email } });

    if (admin && (await admin.matchPassword(password))) {
      // Update last login
      admin.ultimo_acceso = new Date();
      await admin.save();
      
      res.json({
        _id: admin.id,
        nombre: admin.nombre,
        email: admin.email,
        permisos: admin.permisos,
        token: generateToken(admin.id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Error interno del servidor en login de administrador' });
  }
};
