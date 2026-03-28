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

// @desc    Get all admins
// @route   GET /api/admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.findAll({
      attributes: ['id', 'nombre', 'email', 'permisos', 'ultimo_acceso', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(admins);
  } catch (error) {
    console.error("Get Admins Error:", error);
    res.status(500).json({ message: 'Error al obtener administradores' });
  }
};

// @desc    Create admin
// @route   POST /api/admins
export const createAdmin = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const exists = await AdminUser.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'Ya existe un administrador con ese email' });
    }

    const admin = await AdminUser.create({ nombre, email, password });
    res.status(201).json({
      id: admin.id,
      nombre: admin.nombre,
      email: admin.email,
      permisos: admin.permisos,
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ message: 'Error al crear administrador' });
  }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
export const updateAdmin = async (req, res) => {
  const { nombre, email, password, permisos } = req.body;

  try {
    const admin = await AdminUser.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    if (nombre) admin.nombre = nombre;
    if (email) admin.email = email;
    if (password) admin.password = password;
    if (permisos) admin.permisos = permisos;

    await admin.save();
    res.json({ id: admin.id, nombre: admin.nombre, email: admin.email, permisos: admin.permisos });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ message: 'Error al actualizar administrador' });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await AdminUser.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    await admin.destroy();
    res.json({ message: 'Administrador eliminado correctamente' });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({ message: 'Error al eliminar administrador' });
  }
};
