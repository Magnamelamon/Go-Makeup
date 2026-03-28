import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Save files in the 'backend/uploads' directory
    cb(null, 'backend/uploads/');
  },
  filename(req, file, cb) {
    // Create a unique filename: fieldname-timestamp.extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
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
    cb(new Error('Images only!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the relative URL to access the image
  // It will be served statically by Express under the /uploads route
  res.json(`/${req.file.path.replace(/\\/g, '/')}`); 
});

// @desc    Upload an image from a URL
// @route   POST /api/upload-url
// @access  Private/Admin
router.post('/upload-url', async (req, res) => {
  const { url } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText} (${response.status})`);
    }

    // Check if the content is an image
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
       throw new Error(`URL did not return an image. Mime-type received: ${contentType}`);
    }

    // Use a timestamp and default extension if unavailable
    let extName = path.extname(new URL(url).pathname);
    if (!extName) {
      // derive from content type like "image/png" -> ".png"
      extName = '.' + contentType.split('/')[1]; 
    }
    
    // Fallback cleanup
    extName = extName.split('?')[0]; 
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(extName.toLowerCase())) {
        extName = '.jpg';
    }

    const filename = `url-${Date.now()}${extName}`;
    const filepath = path.join('backend', 'uploads', filename);

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    
    res.json(`/${filepath.replace(/\\/g, '/')}`);

  } catch (error) {
    console.error("Error downloading image from URL:", error);
    res.status(500).json({ message: error.message || 'Error processing URL' });
  }
});

export default router;
