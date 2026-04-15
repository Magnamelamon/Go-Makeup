import { sequelize } from './config/db.js';
import { Catalog } from './models/Catalog.js';
import { CatalogVariant } from './models/CatalogVariant.js';

async function seedNailProduct() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL');

    // Crear producto de esmalte de uñas
    const product = await Catalog.create({
      id: 'esmalte-test-001',
      nombre: 'Esmalte Gel Semi-Permanente',
      descripcion: 'Esmalte gel de larga duración con acabado espejo. Fórmula vegana y cruelty-free. Secado rápido con lámpara UV/LED. Duración de hasta 21 días sin astillarse.',
      categoria: 'uñas',
      marca: 'Go Makeup Nails',
      urlShein: '',
      urlTiktok: '',
    });

    console.log('✅ Producto creado:', product.id);

    // Crear variantes con colores reales
    const variantes = [
      {
        id_variante: 'esmalte-v1-cherry',
        catalog_id: product.id,
        color: '#e11d48',
        color_nombre: 'Cherry Red',
        precio: 149.00,
        precio_descuento: 119.00,
        stock: 25,
        imagenes: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600'],
      },
      {
        id_variante: 'esmalte-v2-pink',
        catalog_id: product.id,
        color: '#f472b6',
        color_nombre: 'Soft Pink',
        precio: 149.00,
        precio_descuento: null,
        stock: 30,
        imagenes: ['https://images.unsplash.com/photo-1632344339650-6dff tried4aeed?w=600'],
      },
      {
        id_variante: 'esmalte-v3-magenta',
        catalog_id: product.id,
        color: '#be185d',
        color_nombre: 'Magenta Glam',
        precio: 159.00,
        precio_descuento: 129.00,
        stock: 15,
        imagenes: ['https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600'],
      },
      {
        id_variante: 'esmalte-v4-nude',
        catalog_id: product.id,
        color: '#d6d3d1',
        color_nombre: 'Nude Beige',
        precio: 139.00,
        precio_descuento: null,
        stock: 40,
        imagenes: ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600'],
      },
      {
        id_variante: 'esmalte-v5-black',
        catalog_id: product.id,
        color: '#171717',
        color_nombre: 'Onyx Black',
        precio: 149.00,
        precio_descuento: null,
        stock: 20,
        imagenes: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600'],
      },
    ];

    await CatalogVariant.bulkCreate(variantes);
    console.log(`✅ ${variantes.length} variantes creadas`);

    console.log('\n🎉 Producto de prueba listo. Ve a:');
    console.log('   http://localhost:5173/producto/esmalte-test-001');
    console.log('   http://localhost:5173/catalogo/uñas\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedNailProduct();
