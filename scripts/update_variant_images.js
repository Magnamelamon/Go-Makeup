import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Catalog } from '../backend/models/Catalog.js';

dotenv.config();

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/go_makeup_db');
    console.log('MongoDB Connected');

    // Find a product with multiple variants to update, e.g. "Labial Líquido Mate"
    const product = await Catalog.findOne({ "variantes.1": { "$exists": true } });
    
    if (product) {
       console.log(`Updating product: ${product.nombre}`);
       
       // Give each variant distinct images so it's obvious when they change
       const testImages = [
         ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'],
         ['https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?w=800', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'],
         ['https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800']
       ];

       for (let i = 0; i < product.variantes.length; i++) {
          product.variantes[i].imagenes = testImages[i % testImages.length];
       }

       await product.save();
       console.log('Product variants updated successfully!');
    } else {
       console.log('No product with multiple variants found.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateImages();
