import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { sequelize } from '../config/db.js';
import { Catalog } from '../models/Catalog.js';
import { CatalogVariant } from '../models/CatalogVariant.js';

// Get the CSV file path from arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Por favor provee el archivo CSV como argumento.');
  console.log('Uso: node import_csv.js <ruta_al_archivo_csv>');
  process.exit(1);
}

const csvFilePath = path.resolve(process.cwd(), args[0]);

if (!fs.existsSync(csvFilePath)) {
  console.error(`El archivo "${csvFilePath}" no existe.`);
  process.exit(1);
}

// Maps to group the products and their variants
const productsMap = new Map();
const variantsList = [];

console.log(`Leyendo datos desde: ${csvFilePath}...`);

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => {
    try {
      // 1. Extract product data
      const productId = data.id?.trim();
      if (!productId) return; // Skip empty rows

      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          id: productId,
          nombre: data.nombre?.trim() || '',
          descripcion: data.descripcion?.trim() || '',
          categoria: data.categoria?.trim() || 'General',
          urlShein: data.urlShein?.trim() || null,
          urlTiktok: data.urlTiktok?.trim() || null,
        });
      }

      // 2. Extract variant data (if variant ID is provided)
      const variantId = data.id_variante?.trim();
      if (variantId) {
        // Parse numbers safely
        let precio = parseFloat(data.precio);
        if (isNaN(precio)) precio = 0;

        let precio_descuento = parseFloat(data.precio_descuento);
        if (isNaN(precio_descuento)) precio_descuento = null; // null if no discount

        let stock = parseInt(data.stock, 10);
        if (isNaN(stock)) stock = 0;

        // Parse images if comma-separated
        let imagesArray = [];
        if (data.imagenes && data.imagenes.trim() !== '') {
          imagesArray = data.imagenes.split(',').map(url => url.trim());
        }

        variantsList.push({
          id_variante: variantId,
          catalog_id: productId,
          color: data.color?.trim() || '#000000',
          color_nombre: data.color_nombre?.trim() || 'Default',
          precio: precio,
          precio_descuento: precio_descuento,
          stock: stock,
          imagenes: imagesArray
        });
      }
    } catch (err) {
      console.error(`Error procesando fila para producto ${data.id}:`, err);
    }
  })
  .on('end', async () => {
    console.log(`Lectura completada: ${productsMap.size} productos únicos y ${variantsList.length} variantes encontradas.`);
    
    // Convert products map to array
    const productsArray = Array.from(productsMap.values());

    if (productsArray.length === 0) {
      console.log('No se encontraron productos en el CSV para importar.');
      process.exit(0);
    }

    try {
      // Authenticate with the database
      await sequelize.authenticate();
      console.log('Conexión a la base de datos establecida correctamente.');
      
      // Do the import inside a transaction
      const t = await sequelize.transaction();
      
      try {
        console.log('Insertando o actualizando productos principales...');
        await Catalog.bulkCreate(productsArray, {
          transaction: t,
          updateOnDuplicate: ['nombre', 'descripcion', 'categoria', 'urlShein', 'urlTiktok'] // Upsert logic
        });

        console.log('Insertando o actualizando variantes...');
        await CatalogVariant.bulkCreate(variantsList, {
          transaction: t,
          updateOnDuplicate: ['color', 'color_nombre', 'precio', 'precio_descuento', 'stock', 'imagenes'] // Upsert logic
        });

        await t.commit();
        console.log('✅ Importación masiva completada exitosamente.');
      } catch (insertError) {
        await t.rollback();
        console.error('❌ Error durante la inserción en Base de Datos. Los cambios han sido revertidos.');
        throw insertError;
      }

    } catch (dbError) {
      console.error('Error con la Base de Datos:', dbError);
    } finally {
      process.exit(0);
    }
  });
