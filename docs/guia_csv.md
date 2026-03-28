# Guía de Carga Masiva por CSV — Go Makeup

## Formato del Archivo CSV

El archivo CSV debe utilizar **comas** como separador y tener la primera fila como **encabezados**.

### Columnas Requeridas

| Columna | Requerida | Descripción | Ejemplo |
|---|---|---|---|
| `id` | ✅ Sí | ID único del producto | `LAB-01` |
| `nombre` | ✅ Sí | Nombre comercial del producto | `Labial Velvet Premium` |
| `descripcion` | No | Descripción del producto | `Labial de larga duración...` |
| `categoria` | No | Categoría (default: `labiales`) | `labiales`, `ojos`, `rostro`, `uñas` |
| `urlShein` | No | Enlace de compra en Shein | `https://shein.com/...` |
| `urlTiktok` | No | Enlace de compra en TikTok Shop | `https://tiktok.com/...` |
| `id_variante` | ✅ Sí | ID único de la variante | `var-rojo-01` |
| `color` | No | Código hexadecimal del color | `#C41E3A` |
| `color_nombre` | No | Nombre del color (default: `Muestra`) | `Rojo Cereza` |
| `precio` | ✅ Sí | Precio de la variante | `189.99` |
| `precio_descuento` | No | Precio con descuento (dejar vacío si no aplica) | `149.99` |
| `stock` | No | Cantidad en inventario (default: `0`) | `50` |
| `imagen_1` | No | URL de la primera imagen | `https://...` |
| `imagen_2` | No | URL de la segunda imagen | `https://...` |
| `imagen_3` | No | URL de la tercera imagen | `https://...` |
| `imagen_4` | No | URL de la cuarta imagen | `https://...` |
| `imagen_5` | No | URL de la quinta imagen | `https://...` |

### Reglas Importantes

1. **Un producto con múltiples colores** se define en **múltiples filas** con el mismo `id` y `nombre`.
2. Cada fila representa **una variante** (un color/tono del producto).
3. Las columnas `imagen_2` a `imagen_5` son opcionales — dejar vacías si solo hay una foto.
4. Si `precio_descuento` está vacío, el producto se muestra sin oferta.
5. Las categorías válidas son: `labiales`, `ojos`, `rostro`, `uñas`.

---

## Ejemplo Completo

```csv
id,nombre,descripcion,categoria,urlShein,urlTiktok,id_variante,color,color_nombre,precio,precio_descuento,stock,imagen_1,imagen_2,imagen_3,imagen_4,imagen_5
LAB-01,Labial Velvet Premium,Labial de larga duración con acabado aterciopelado,labiales,https://shein.com/labial,https://tiktok.com/labial,var-rojo,#C41E3A,Rojo Cereza,189.99,149.99,50,https://ejemplo.com/rojo1.jpg,https://ejemplo.com/rojo2.jpg,,,
LAB-01,Labial Velvet Premium,Labial de larga duración con acabado aterciopelado,labiales,https://shein.com/labial,https://tiktok.com/labial,var-rosa,#FF69B4,Rosa Chicle,189.99,,35,https://ejemplo.com/rosa1.jpg,,,,
SOM-01,Paleta Sunset,12 tonos cálidos para el atardecer,ojos,,https://tiktok.com/paleta,var-sunset,#FF6347,Multicolor,299.00,249.00,25,https://ejemplo.com/paleta.jpg,,,,
BASE-01,Base Matte HD,Cobertura total con efecto matte profesional,rostro,,,var-claro,#F5DEB3,Tono Claro,350.00,,40,https://ejemplo.com/base-claro.jpg,,,,
BASE-01,Base Matte HD,Cobertura total con efecto matte profesional,rostro,,,var-medio,#D2B48C,Tono Medio,350.00,,30,https://ejemplo.com/base-medio.jpg,,,,
BASE-01,Base Matte HD,Cobertura total con efecto matte profesional,rostro,,,var-oscuro,#8B7355,Tono Oscuro,350.00,,20,https://ejemplo.com/base-oscuro.jpg,,,,
```

### Vista Visual del Ejemplo

| Producto | Variantes | Stock Total |
|---|---|---|
| Labial Velvet Premium | 🔴 Rojo Cereza, 🩷 Rosa Chicle | 85 |
| Paleta Sunset | 🎨 Multicolor | 25 |
| Base Matte HD | ⬜ Claro, 🟨 Medio, 🟫 Oscuro | 90 |

---

## Cómo Subir el CSV

1. Inicia sesión en el panel admin: `tu-sitio.vercel.app/admin-login`
2. Haz clic en el botón **📤 Cargar Feed (JSON/CSV)**
3. Selecciona tu archivo `.csv`
4. Espera el mensaje de confirmación: *"¡Feed cargado y sincronizado exitosamente con la base de datos!"*

> **Nota:** Si un producto con el mismo `id` ya existe, se creará como un registro nuevo. Para actualizar productos existentes, elimínalos primero desde el panel de administración.

---

## Archivo de Ejemplo

Se incluye un archivo de ejemplo listo para usar: [`ejemplo_catalogo.csv`](ejemplo_catalogo.csv)
