import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../backend/config/db.js';
import { Catalog } from '../backend/models/Catalog.js';
import { User } from '../backend/models/User.js';
import { AdminUser } from '../backend/models/AdminUser.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const productsJsonPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Catalog.deleteMany();
    await User.deleteMany();
    await AdminUser.deleteMany();
    
    // Mock Users
    const users = [
      {
        nombre: 'María Gómez',
        email: 'maria@example.com',
        password: 'password123', // In a real app, this should be hashed
        direcciones: [{ calle: 'Av Reforma 123', ciudad: 'Cdmx', codigo_postal: '10000' }]
      },
      {
        nombre: 'Carlos Ruiz',
        email: 'carlos@example.com',
        password: 'password123'
      },
      {
        nombre: 'Ana Trujillo',
        email: 'ana@example.com',
        password: 'password123'
      }
    ];

    // Mock Admin Users
    const adminUsers = [
      {
        nombre: 'Admin Principal',
        email: 'admin@gomakeup.com',
        password: 'adminpassword', 
        permisos: { puede_gestionar_catalogo: true, puede_gestionar_usuarios: true }
      },
      {
        nombre: 'Gestor Catálogo',
        email: 'catalogo@gomakeup.com',
        password: 'adminpassword',
        permisos: { puede_gestionar_catalogo: true, puede_gestionar_usuarios: false }
      },
      {
        nombre: 'Soporte Usuarios',
        email: 'soporte@gomakeup.com',
        password: 'adminpassword',
        permisos: { puede_gestionar_catalogo: false, puede_gestionar_usuarios: true }
      }
    ];

    // Insert products, users, and admins
    await Catalog.insertMany(products);
    
    // Use create to trigger pre-save middleware (bcrypt)
    for (const user of users) {
      // Temporarily mock User creation to just avoid errors if we add hooks to User later
      await User.create(user);
    }
    
    for (const admin of adminUsers) {
      await AdminUser.create(admin);
    }
    
    console.log('Data Imported successfully into MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Catalog.deleteMany();
    await User.deleteMany();
    await AdminUser.deleteMany();

    console.log('Data Destroyed from MongoDB Atlas!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
