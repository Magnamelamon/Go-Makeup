import connectDB from './config/db.js';
import { Catalog } from './models/Catalog.js';
import { CatalogVariant } from './models/CatalogVariant.js';

async function show() {
  try {
    await connectDB();
    const data = await Catalog.findAll({
      include: [{
        model: CatalogVariant,
        as: 'variantes'
      }]
    });
    
    console.log("\n=======================================================");
    console.log("   CONTENIDO ACTUAL DE LA BASE DE DATOS POSTGRESQL     ");
    console.log("=======================================================\n");
    
    if (data.length === 0) {
       console.log("La base de datos está vacía. Aún no hay maquillajes.");
    } else {
       data.forEach((p, index) => {
         const product = p.toJSON();
         console.log(`[${index + 1}] ID: ${product.id}`);
         console.log(`    Nombre:    ${product.nombre}`);
         console.log(`    Categoría: ${product.categoria}`);
         console.log(`    Variantes: ${product.variantes.length} colores guardados en DB.`);
         if (product.variantes.length > 0) {
            console.table(product.variantes.map(v => ({
                Color: v.color_nombre, 
                Hex: v.color, 
                Precio: v.precio, 
                Stock: v.stock 
            })));
         }
         console.log("-------------------------------------------------------");
       });
    }

  } catch(e) {
    console.error("Error consultando DB:", e.message);
  } finally {
    process.exit();
  }
}

show();
