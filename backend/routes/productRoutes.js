import express from 'express';
import { Catalog } from '../models/Catalog.js';
import { CatalogVariant } from '../models/CatalogVariant.js';
import { sequelize } from '../config/db.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Catalog.findAll({
      include: [{ model: CatalogVariant, as: 'variantes' }]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Catalog.findByPk(req.params.id, {
      include: [{ model: CatalogVariant, as: 'variantes' }]
    });
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @desc    Create a product with variants
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id, nombre, descripcion, categoria, urlShein, urlTiktok, variantes } = req.body;

    const product = await Catalog.create({
      id, nombre, descripcion, categoria, urlShein, urlTiktok
    }, { transaction: t });

    if (variantes && variantes.length > 0) {
      const variantsData = variantes.map(v => ({ ...v, catalog_id: product.id }));
      await CatalogVariant.bulkCreate(variantsData, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @desc    Update a product with variants
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { nombre, descripcion, categoria, urlShein, urlTiktok, variantes } = req.body;
    const productId = req.params.id;

    const product = await Catalog.findByPk(productId);
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.update({ nombre, descripcion, categoria, urlShein, urlTiktok }, { transaction: t });
    await CatalogVariant.destroy({ where: { catalog_id: productId }, transaction: t });
    
    if (variantes && variantes.length > 0) {
      const variantsData = variantes.map(v => ({ ...v, catalog_id: productId }));
      await CatalogVariant.bulkCreate(variantsData, { transaction: t });
    }

    await t.commit();
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const productId = req.params.id;
    const product = await Catalog.findByPk(productId);
    
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await CatalogVariant.destroy({ where: { catalog_id: productId }, transaction: t });
    await product.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
