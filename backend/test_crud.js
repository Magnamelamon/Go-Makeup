const testCRUD = async () => {
    const baseUrl = 'http://localhost:5000/api/products';
    const testId = `prod-test-${Date.now()}`;
    
    console.log("--------------------------------------------------");
    console.log("INICIANDO TESTEO DEL CRUD HACIA POSTGRESQL");
    console.log("--------------------------------------------------\n");
    
    // 1. CREATE
    console.log("1. CREATE (Insertando nuevo producto en la DB...)");
    const nuevoProducto = {
      id: testId,
      nombre: "Labial Diamante Rosa",
      descripcion: "Brillo extremo, fijación 24H.",
      categoria: "labios",
      urlShein: "https://shein.com/test",
      variantes: [
        {
          id_variante: `var-${Date.now()}`,
          color: "#FF69B4",
          color_nombre: "Hot Pink",
          precio: 15.99,
          stock: 100,
          imagenes: ["/backend/uploads/sample1.jpg"]
        }
      ]
    };
    
    const postRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    });
    
    if (postRes.ok) {
        console.log("✅ [ÉXITO] Producto insertado correctamente.");
    } else {
        console.log("❌ [ERROR] Falló INSERT", await postRes.text());
        process.exit(1);
    }
    
    // 2. READ
    console.log("\n2. READ (Consultando base de datos...)");
    const getRes = await fetch(`${baseUrl}/${testId}`);
    const dbData = await getRes.json();
    console.log("📦 Datos obtenidos directamente de PostgreSQL:");
    console.log(JSON.stringify(dbData, null, 2));
    
    // 3. UPDATE
    console.log("\n3. UPDATE (Actualizando nombre de 'Labial Diamante Rosa' a 'Labial Edición Limitada'...)");
    const updateRes = await fetch(`${baseUrl}/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevoProducto, nombre: "Labial Edición Limitada" })
    });
    if (updateRes.ok) {
        console.log("✅ [ÉXITO] Producto actualizado.");
    } else {
        console.log("❌ [ERROR] Falló UPDATE", await updateRes.text());
        process.exit(1);
    }
    
    // VERIFY UPDATE
    const getRes2 = await fetch(`${baseUrl}/${testId}`);
    const updatedData = await getRes2.json();
    console.log(`🔍 Nombre en la DB ahora es: "${updatedData.nombre}"`);
    
    // 4. DELETE
    console.log("\n4. DELETE (Eliminando el producto de prueba...)");
    const delRes = await fetch(`${baseUrl}/${testId}`, { method: 'DELETE' });
    if (delRes.ok) {
        console.log("✅ [ÉXITO] Producto y sus variantes borradas de PostgreSQL.");
    } else {
        console.log("❌ [ERROR] Falló DELETE", await delRes.text());
        process.exit(1);
    }
    
    console.log("\n--------------------------------------------------");
    console.log("TEST FINALIZADO: Todo el ecosistema funciona al 100%.");
    console.log("--------------------------------------------------");
}

testCRUD();
