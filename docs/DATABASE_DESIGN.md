# Eliminación de Datos Dummy (Limpieza de Proyecto)

Como solicitaste, vamos a dejar el proyecto completamente limpio para su futura integración real con el backend. A continuación detallo los archivos y secciones de código que eliminaré/limpiaré.

## Archivos a Eliminar
### [DELETE] `src/data/products.json`
- Eliminaremos el archivo JSON completo que contenía todos los datos falsos del catálogo.

## Archivos a Modificar (Limpieza de código duro)

### [MODIFY] `src/data/products.ts`
- Se eliminará la importación del archivo `products.json`.
- El arreglo inicial de productos pasará de tener toda la data a ser un arreglo completamente vacío `[]`.
- Esto hará que la aplicación inicie con el catálogo limpio (sin items visualizados en el frontend).

### [MODIFY] `src/data/users.ts`
- Se eliminará la información de "Admin" y "Usuario" por defecto de la base local de la configuración inicial en `initialUsersData`. Esto pasará a ser `[]`.
- Se requerirá un registro manual en el futuro.

### [MODIFY] `src/pages/Login/Login.tsx`
- Se eliminará el bloque de HTML visual (`<div className="login-demo">...</div>`) que mostraba las "Cuentas de prueba" en la pantalla de inicio de sesión a los usuarios reales.

### [MODIFY] `scripts/seeder.js`
- Al eliminar `products.json`, el script de llenado de base de datos fallaría al buscar el archivo. 
- Modificaré el script para que ya no importe el JSON y que, en cambio, la base de datos se limpie y quede pronta para un CRUD real, o dejar un solo producto de ejemplo muy básico que no sea información dummy estorbosa. Lo ideal es dejarlo limpio y eliminar la ingesta masiva de mock.

## Resultado
Una vez ejecutado este plan, la interfaz de inicio (Home), el Catálogo y el Login de Go Makeup no tendrán ninguna información falsa, estando listos para consumir los datos reales vía API cuando se construya el servicio de Node.js.
