import connectDB from './config/db.js';
import { Catalog } from './models/Catalog.js';
import { CatalogVariant } from './models/CatalogVariant.js';
import fs from 'fs';

async function dump() {
  try {
    await connectDB();
    const data = await Catalog.findAll({
      include: [{
        model: CatalogVariant,
        as: 'variantes'
      }]
    });
    
    let md = `# Reporte de Base de Datos: PostgreSQL\n\n`;
    md += `A continuación se muestra el contenido exacto almacenado en la base de datos oficial del servidor:\n\n`;
    
    if (data.length === 0) {
       md += `> La base de datos está actualmente vacía. No hay productos registrados.\n`;
    } else {
       data.forEach((p, index) => {
         const product = p.toJSON();
         md += `### ${index + 1}. ${product.nombre}\n`;
         md += `- **ID en DB:** \`${product.id}\`\n`;
         md += `- **Categoría:** ${product.categoria}\n`;
         md += `- **Descripción:** ${product.descripcion}\n\n`;
         
         if (product.variantes.length > 0) {
            md += `#### Variantes Registradas (${product.variantes.length})\n`;
            md += `| ID Variante | Color Nombre | Color HEX | Precio | Stock |\n`;
            md += `| :--- | :--- | :--- | :--- | :--- |\n`;
            product.variantes.forEach(v => {
               md += `| \`${v.id_variante}\` | ${v.color_nombre} | \`${v.color}\` | $${v.precio} | ${v.stock} uds |\n`;
            });
            md += `\n`;
         } else {
            md += `*-- Sin variantes vinculadas --*\n\n`;
         }
         md += `---\n\n`;
       });
    }

    fs.writeFileSync('C:\\Users\\crism\\.gemini\\antigravity\\brain\\4d816183-fd1b-4a70-b57e-6b2176a8917c\\db_report.md', md);
    console.log("Report generated.");

  } catch(e) {
    console.error("Error consultando DB:", e.message);
  } finally {
    process.exit();
  }
}

dump();
