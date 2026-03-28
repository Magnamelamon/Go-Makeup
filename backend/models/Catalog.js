import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Catalog = sequelize.define('Catalog', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  urlShein: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  urlTiktok: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});
