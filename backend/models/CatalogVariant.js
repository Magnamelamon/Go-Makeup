import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Catalog } from './Catalog.js';

export const CatalogVariant = sequelize.define('CatalogVariant', {
  id_variante: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  catalog_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Catalog,
      key: 'id'
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color_nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  precio_descuento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  imagenes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

Catalog.hasMany(CatalogVariant, { foreignKey: 'catalog_id', as: 'variantes' });
CatalogVariant.belongsTo(Catalog, { foreignKey: 'catalog_id' });
