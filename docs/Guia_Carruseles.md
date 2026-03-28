# 🎡 Guía de Carruseles en Go Makeup

El proyecto Go Makeup cuenta con dos tipos de carruseles principales diseñados para mantener la tienda dinámica y visualmente atractiva:

1. **Carousel Principal (Banner/Hero)**: Usado para anuncios grandes, colecciones nuevas o promociones globales.
2. **Product Carousel (Tarjetas)**: Usado para mostrar listas de productos deslizables (ej. "Destacados", "Recién Llegados").

A continuación, se explica cómo crear e insertar cada uno en cualquier página de React.

---

## 1. Carrusel Principal de Anuncios (`<Carousel />`)

Este componente recibe una lista estática de "Diapositivas" (Slides) configurables.

**Importación requerida en tu archivo TSX:**
```tsx
import Carousel from '../../components/Carousel/Carousel';
```

**Estructura de la data (Slides):**
Debes crear un arreglo donde cada elemento definirá una diapositiva:
```tsx
const misAnuncios = [
  {
    imagen: 'https://ruta-de-la-imagen.jpg',
    titulo: 'Gran Venta de Verano',
    subtitulo: 'Descuentos del 50%',
    botonTexto: 'Ver Todo',
    link: '/catalogo/rostro' // Hacia dónde lleva el botón
  },
  {
    imagen: 'https://otra-imagen.jpg',
    titulo: 'Nueva Colección',
    subtitulo: 'Skincare',
    botonTexto: 'Descubrir',
    link: '/catalogo/skincare'
  }
];
```

**Implementación en la página:**
Simplemente pasas el arreglo a la propiedad `slides`:
```tsx
<Carousel slides={misAnuncios} autoSlide={true} intervalo={5000} />
```
*(Nota: `autoSlide` e `intervalo` son opcionales. Por defecto se deslizará solo cada 5 segundos).*

---

## 2. Carrusel de Productos (`<ProductCarousel />`)

Este componente es el más fuerte y dinámico. Se encarga de pintar las "Cards" (tarjetas) de los maquillajes. Solo necesita que le entregues una sub-lista de productos provenientes de la base de datos PostgreSQL.

**Importación requerida:**
```tsx
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
```

### ¿Cómo alimentarlo desde la Base de Datos?

1. En tu vista/página (ej. `Home.tsx`), debes tener el estado donde guardas el llamado (fetch) local a la base de datos con **todos los productos**.
```tsx
const [productos, setProductos] = useState([]);

useEffect(() => {
  fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => setProductos(data));
}, []);
```

2. Una vez que tienes tu variable `productos` llena de información, **fabricas las agrupaciones (cortes o filtros)** que quieres mostrar usando utilidades nativas de JavaScript como `.slice()` o `.filter()`.

**Ejemplo A: Recortando los primeros 10 productos (Destacados)**
```tsx
const destacados = productos.slice(0, 10);

// En el HTML/JSX de retorno:
<ProductCarousel productos={destacados} titulo="Nuestra Selección" />
```

**Ejemplo B: Filtrando por una categoría exacta (ej. Sólo para Uñas)**
```tsx
const productosUnas = productos.filter(p => p.categoria === 'uñas');

// En el HTML/JSX de retorno:
<ProductCarousel productos={productosUnas} titulo="Dale color a tus uñas" />
```

**Ejemplo C: Filtrar inteligentemente (Solo productos que tengan un precio de oferta/descuento activo)**
```tsx
// Revisa cada producto y verifica si dentro de sus variantes tiene un "precio_descuento" diferente de null o vacío.
const productosEnOferta = productos.filter(p => 
  p.variantes.some(variante => variante.precio_descuento !== null)
);

// En el HTML/JSX de retorno:
<ProductCarousel productos={productosEnOferta} titulo="¡Ofertas Especiales!" />
```

### Resumen Rápido
Para inyectar un carrusel de tarjetas de maquillaje en Go Makeup, la regla de oro es: **Obtén tu base de datos completa -> Filtra la sublista como dicten tus necesidades -> Pásasela al componente `<ProductCarousel />`.** Esta arquitectura centralizada significa que nunca más tendrás que dibujar botones, precios o fotos manualmente.
