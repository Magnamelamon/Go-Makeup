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

// Middleware
app.use(cors()); // Allow cross-origin requests from React
app.use(express.json()); // Allow parsing JSON bodies

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

const PORT = 5000; // Using a fixed port for the backend

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
