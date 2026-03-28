import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import path from 'path';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// FIX #2: Restrict CORS to allowed origins only
const allowedOrigins = [
  'https://go-makeup.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('No permitido por CORS'), false);
  },
  credentials: true
}));

app.use(express.json({ limit: '2mb' })); // Limit JSON body size

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Static folder for images
const __dirname = path.resolve();
app.use('/backend/uploads', express.static(path.join(__dirname, '/backend/uploads')));

// Basic Home route
app.get('/', (req, res) => {
  res.send('Go Makeup API IS RUNNING...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
