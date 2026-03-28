import express from 'express';
import { authAdmin, getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.post('/login', authAdmin);

// Protected — requires Bearer token
router.get('/', protect, getAdmins);
router.post('/', protect, createAdmin);
router.put('/:id', protect, updateAdmin);
router.delete('/:id', protect, deleteAdmin);

export default router;
