import { Catalog } from '../models/Catalog.js';
import { CatalogVariant } from '../models/CatalogVariant.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Catalog.findAll({
      include: [{ model: CatalogVariant, as: 'variantes' }]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar los productos' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
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
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
