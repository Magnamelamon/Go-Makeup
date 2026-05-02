import { sequelize } from './config/db.js';
import { Catalog } from './models/Catalog.js';
import { CatalogVariant } from './models/CatalogVariant.js';

const products = [
  {
    id: 'esmalte-gel-clasico',
    nombre: 'Esmalte Gel Clásico',
    descripcion: 'Esmalte en gel de acabado brillante con fórmula de secado rápido bajo lámpara UV/LED. Cobertura uniforme desde la primera capa. Duración de hasta 14 días.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'gel-clas-rojo-pasion', color: '#DC143C', color_nombre: 'Rojo Pasión', precio: 139.00, precio_descuento: 109.00, stock: 35 },
      { id_variante: 'gel-clas-borgoña', color: '#800020', color_nombre: 'Borgoña', precio: 139.00, precio_descuento: null, stock: 28 },
      { id_variante: 'gel-clas-coral', color: '#FF6F61', color_nombre: 'Coral Sunset', precio: 139.00, precio_descuento: null, stock: 22 },
      { id_variante: 'gel-clas-vino', color: '#722F37', color_nombre: 'Vino Tinto', precio: 139.00, precio_descuento: 119.00, stock: 18 },
    ]
  },
  {
    id: 'esmalte-matte-velvet',
    nombre: 'Esmalte Matte Velvet',
    descripcion: 'Acabado mate aterciopelado de alta pigmentación. Fórmula libre de tolueno, formaldehído y DBP. Textura suave al tacto con efecto terciopelo.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'matte-negro-absoluto', color: '#1a1a1a', color_nombre: 'Negro Absoluto', precio: 159.00, precio_descuento: null, stock: 40 },
      { id_variante: 'matte-gris-humo', color: '#6B6B6B', color_nombre: 'Gris Humo', precio: 159.00, precio_descuento: null, stock: 32 },
      { id_variante: 'matte-azul-noche', color: '#191970', color_nombre: 'Azul Medianoche', precio: 159.00, precio_descuento: 129.00, stock: 25 },
      { id_variante: 'matte-verde-bosque', color: '#2D5A27', color_nombre: 'Verde Bosque', precio: 159.00, precio_descuento: null, stock: 20 },
      { id_variante: 'matte-terracota', color: '#CC5533', color_nombre: 'Terracota', precio: 159.00, precio_descuento: null, stock: 30 },
    ]
  },
  {
    id: 'esmalte-glitter-luxe',
    nombre: 'Esmalte Glitter Luxe',
    descripcion: 'Esmalte con partículas de glitter holográfico para un acabado deslumbrante. Ideal para ocasiones especiales. Fórmula de larga duración con brillo multidimensional.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'glitter-oro-rosa', color: '#B76E79', color_nombre: 'Oro Rosa', precio: 179.00, precio_descuento: 149.00, stock: 15 },
      { id_variante: 'glitter-plata-estelar', color: '#C0C0C0', color_nombre: 'Plata Estelar', precio: 179.00, precio_descuento: null, stock: 20 },
      { id_variante: 'glitter-champagne', color: '#F7E7CE', color_nombre: 'Champagne', precio: 179.00, precio_descuento: null, stock: 25 },
    ]
  },
  {
    id: 'esmalte-neon-pop',
    nombre: 'Esmalte Neón Pop',
    descripcion: 'Colores neón ultra vibrantes que brillan bajo luz UV. Fórmula de secado rápido al aire. Perfectos para festivales y looks atrevidos de verano.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'neon-rosa-electrico', color: '#FF1493', color_nombre: 'Rosa Eléctrico', precio: 129.00, precio_descuento: 99.00, stock: 45 },
      { id_variante: 'neon-verde-lima', color: '#39FF14', color_nombre: 'Verde Lima', precio: 129.00, precio_descuento: null, stock: 38 },
      { id_variante: 'neon-naranja-fuego', color: '#FF4500', color_nombre: 'Naranja Fuego', precio: 129.00, precio_descuento: null, stock: 30 },
      { id_variante: 'neon-amarillo-sol', color: '#FFD700', color_nombre: 'Amarillo Sol', precio: 129.00, precio_descuento: 99.00, stock: 28 },
      { id_variante: 'neon-morado-uv', color: '#BF00FF', color_nombre: 'Morado UV', precio: 129.00, precio_descuento: null, stock: 22 },
      { id_variante: 'neon-azul-cyan', color: '#00FFFF', color_nombre: 'Azul Cyan', precio: 129.00, precio_descuento: null, stock: 35 },
    ]
  },
  {
    id: 'esmalte-nude-collection',
    nombre: 'Esmalte Nude Collection',
    descripcion: 'Colección de tonos nude y neutros para un look natural y sofisticado. Acabado semitransparente buildable. Ideal para uso diario y oficina.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'nude-ballet-pink', color: '#F4C2C2', color_nombre: 'Ballet Pink', precio: 149.00, precio_descuento: null, stock: 50 },
      { id_variante: 'nude-cafe-latte', color: '#C4A882', color_nombre: 'Café Latte', precio: 149.00, precio_descuento: null, stock: 42 },
      { id_variante: 'nude-melocoton', color: '#FFDAB9', color_nombre: 'Melocotón', precio: 149.00, precio_descuento: 119.00, stock: 38 },
      { id_variante: 'nude-arena', color: '#C2B280', color_nombre: 'Arena', precio: 149.00, precio_descuento: null, stock: 35 },
    ]
  },
  {
    id: 'esmalte-french-tip',
    nombre: 'Esmalte French Tip',
    descripcion: 'Esmalte blanco cremoso de cobertura total para puntas francesas perfectas. Fórmula autopegante que no requiere base. Incluye guía de aplicación.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'french-blanco-puro', color: '#FFFFFF', color_nombre: 'Blanco Puro', precio: 119.00, precio_descuento: null, stock: 60 },
      { id_variante: 'french-marfil', color: '#FFFFF0', color_nombre: 'Marfil', precio: 119.00, precio_descuento: null, stock: 45 },
      { id_variante: 'french-rosa-bebe', color: '#FFD1DC', color_nombre: 'Rosa Bebé', precio: 119.00, precio_descuento: 99.00, stock: 55 },
    ]
  },
  {
    id: 'esmalte-chrome-mirror',
    nombre: 'Esmalte Chrome Mirror',
    descripcion: 'Efecto espejo cromado de alta reflexión. Tecnología de pigmentos metálicos para un acabado futurista. Requiere capa base y top coat para máximo efecto.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'chrome-plata', color: '#AAA9AD', color_nombre: 'Plata Chrome', precio: 199.00, precio_descuento: 169.00, stock: 12 },
      { id_variante: 'chrome-oro', color: '#CFB53B', color_nombre: 'Oro Chrome', precio: 199.00, precio_descuento: null, stock: 15 },
      { id_variante: 'chrome-oro-rosa', color: '#E8B4B8', color_nombre: 'Rose Gold Chrome', precio: 199.00, precio_descuento: null, stock: 10 },
      { id_variante: 'chrome-azul', color: '#4682B4', color_nombre: 'Azul Acero Chrome', precio: 199.00, precio_descuento: 169.00, stock: 8 },
    ]
  },
  {
    id: 'esmalte-pastel-dream',
    nombre: 'Esmalte Pastel Dream',
    descripcion: 'Colores pastel suaves y delicados con acabado cremoso. Fórmula enriquecida con biotina y vitamina E para fortalecer las uñas. Ideal para primavera.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'pastel-lila', color: '#C8A2C8', color_nombre: 'Lila Suave', precio: 145.00, precio_descuento: null, stock: 30 },
      { id_variante: 'pastel-menta', color: '#98FF98', color_nombre: 'Menta Fresca', precio: 145.00, precio_descuento: null, stock: 28 },
      { id_variante: 'pastel-celeste', color: '#89CFF0', color_nombre: 'Celeste Cielo', precio: 145.00, precio_descuento: 115.00, stock: 25 },
      { id_variante: 'pastel-durazno', color: '#FFCBA4', color_nombre: 'Durazno', precio: 145.00, precio_descuento: null, stock: 32 },
      { id_variante: 'pastel-amarillo', color: '#FDFD96', color_nombre: 'Amarillo Vainilla', precio: 145.00, precio_descuento: null, stock: 20 },
    ]
  },
  {
    id: 'esmalte-dark-luxe',
    nombre: 'Esmalte Dark Luxe',
    descripcion: 'Colección oscura premium con acabado brillante profundo. Pigmentos ultra concentrados para cobertura total en una sola capa. Colores elegantes para la noche.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'dark-ciruela', color: '#8B008B', color_nombre: 'Ciruela Oscura', precio: 169.00, precio_descuento: null, stock: 20 },
      { id_variante: 'dark-esmeralda', color: '#046307', color_nombre: 'Esmeralda', precio: 169.00, precio_descuento: 139.00, stock: 18 },
      { id_variante: 'dark-zafiro', color: '#0F52BA', color_nombre: 'Azul Zafiro', precio: 169.00, precio_descuento: null, stock: 22 },
      { id_variante: 'dark-oxblood', color: '#4A0000', color_nombre: 'Oxblood', precio: 169.00, precio_descuento: null, stock: 15 },
    ]
  },
  {
    id: 'esmalte-sugar-coat',
    nombre: 'Esmalte Sugar Coat',
    descripcion: 'Acabado texturizado tipo azúcar con micropartículas que crean un efecto arena. No requiere top coat. Secado rápido al aire con textura 3D al tacto.',
    categoria: 'uñas',
    marca: 'Go Makeup Nails',
    variantes: [
      { id_variante: 'sugar-rosa-fresa', color: '#FC5A8D', color_nombre: 'Rosa Fresa', precio: 155.00, precio_descuento: 125.00, stock: 25 },
      { id_variante: 'sugar-morado-uva', color: '#6B3FA0', color_nombre: 'Morado Uva', precio: 155.00, precio_descuento: null, stock: 20 },
      { id_variante: 'sugar-turquesa', color: '#30D5C8', color_nombre: 'Turquesa Tropical', precio: 155.00, precio_descuento: null, stock: 22 },
    ]
  },
];

async function seedNailProducts() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL');

    let totalVariantes = 0;

    for (const prod of products) {
      // Check if product already exists
      const existing = await Catalog.findByPk(prod.id);
      if (existing) {
        console.log(`⏭️  Producto "${prod.nombre}" ya existe, saltando...`);
        continue;
      }

      await Catalog.create({
        id: prod.id,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        categoria: prod.categoria,
        marca: prod.marca,
        urlShein: '',
        urlTiktok: '',
      });

      const variantsData = prod.variantes.map(v => ({
        ...v,
        catalog_id: prod.id,
        imagenes: [`https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600`],
      }));

      await CatalogVariant.bulkCreate(variantsData);
      totalVariantes += variantsData.length;
      console.log(`✅ ${prod.nombre} — ${variantsData.length} variantes`);
    }

    console.log(`\n🎉 Seed completado: ${products.length} productos, ${totalVariantes} variantes totales`);
    console.log('   Ve a: http://localhost:5173/catalogo/uñas\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedNailProducts();
