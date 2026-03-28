import { sequelize } from './config/db.js';
import { AdminUser } from './models/AdminUser.js';
import { Catalog } from './models/Catalog.js';
import { CatalogVariant } from './models/CatalogVariant.js';

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Reset DB purely for testing
    
    // Create admin
    await AdminUser.create({
      nombre: 'Administrador Default',
      email: 'admin@gomakeup.com',
      password: 'password123',
    });

    // Create 1 product
    const product1 = await Catalog.create({
      id: 'prod-001',
      nombre: 'Labial Matte',
      descripcion: 'Labial de larga duración',
      categoria: 'Labios'
    });

    await CatalogVariant.create({
      id_variante: 'var-001',
      catalog_id: 'prod-001',
      color: '#FF0000',
      color_nombre: 'Rojo Pasión',
      precio: 15.99,
      stock: 50,
      imagenes: ['https://via.placeholder.com/150']
    });

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
