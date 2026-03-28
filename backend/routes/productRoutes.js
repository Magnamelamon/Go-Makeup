import express from 'express';
import { Catalog } from '../models/Catalog.js';
import { CatalogVariant } from '../models/CatalogVariant.js';
import { sequelize } from '../config/db.js';

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Catalog.findAll({
      include: [{
        model: CatalogVariant,
        as: 'variantes'
      }]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Catalog.findByPk(req.params.id, {
      include: [{
        model: CatalogVariant,
        as: 'variantes'
      }]
    });
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a product with variants
// @route   POST /api/products
// @access  Private/Admin
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id, nombre, descripcion, categoria, urlShein, urlTiktok, variantes } = req.body;

    // Create the main product
    const product = await Catalog.create({
      id,
      nombre,
      descripcion,
      categoria,
      urlShein,
      urlTiktok
    }, { transaction: t });

    // Create variants if any
    if (variantes && variantes.length > 0) {
      const variantsData = variantes.map(v => ({
        ...v,
        catalog_id: product.id
      }));
      await CatalogVariant.bulkCreate(variantsData, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product: ' + error.message });
  }
});

// @desc    Update a product with variants
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { nombre, descripcion, categoria, urlShein, urlTiktok, variantes } = req.body;
    const productId = req.params.id;

    const product = await Catalog.findByPk(productId);
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update main product
    await product.update({
      nombre,
      descripcion,
      categoria,
      urlShein,
      urlTiktok
    }, { transaction: t });

    // For simplicity, we delete all existing variants and recreate them
    await CatalogVariant.destroy({ where: { catalog_id: productId }, transaction: t });
    
    if (variantes && variantes.length > 0) {
      const variantsData = variantes.map(v => ({
        ...v,
        catalog_id: productId
      }));
      await CatalogVariant.bulkCreate(variantsData, { transaction: t });
    }

    await t.commit();
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product: ' + error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const productId = req.params.id;
    const product = await Catalog.findByPk(productId);
    
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete variants first (if no cascade)
    await CatalogVariant.destroy({ where: { catalog_id: productId }, transaction: t });
    // Delete product
    await product.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Product removed' });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product: ' + error.message });
  }
});

export default router;
