import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = 'backend/uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File validation filter
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Solo imágenes (jpg, jpeg, png, webp)'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // FIX #4: 5MB max
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo' });
  }
  res.json(`/${req.file.path.replace(/\\/g, '/')}`); 
});

// Blocklist for SSRF protection
const BLOCKED_HOSTS = ['127.0.0.1', 'localhost', '0.0.0.0', '169.254.169.254', '[::1]', '10.0.0.1'];

// @desc    Upload an image from a URL
// @route   POST /api/upload-url
// @access  Private/Admin
router.post('/upload-url', protect, async (req, res) => {
  const { url } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL es requerida' });
  }

  // FIX #3: SSRF protection
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ message: 'URL inválida' });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return res.status(400).json({ message: 'Solo se permiten URLs HTTP/HTTPS' });
  }

  if (BLOCKED_HOSTS.includes(parsedUrl.hostname)) {
    return res.status(400).json({ message: 'URL no permitida' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('No se pudo descargar la imagen');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(400).json({ message: 'La URL no contiene una imagen' });
    }

    // Check content-length before downloading
    const contentLength = parseInt(response.headers.get('content-length') || '0');
    if (contentLength > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'La imagen excede el límite de 5MB' });
    }

    let extName = path.extname(new URL(url).pathname);
    if (!extName) {
      extName = '.' + contentType.split('/')[1]; 
    }
    extName = extName.split('?')[0]; 
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(extName.toLowerCase())) {
      extName = '.jpg';
    }

    const filename = `url-${Date.now()}${extName}`;
    const filepath = path.join('backend', 'uploads', filename);

    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Double check actual size
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'La imagen excede el límite de 5MB' });
    }

    fs.writeFileSync(filepath, buffer);
    res.json(`/${filepath.replace(/\\/g, '/')}`);

  } catch (error) {
    console.error("Error downloading image from URL:", error);
    res.status(500).json({ message: 'Error al procesar la URL de imagen' });
  }
});

export default router;
