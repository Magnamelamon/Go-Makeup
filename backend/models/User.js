import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direcciones: {
    type: DataTypes.JSONB,
    defaultValue: [] 
    // Example: [{ calle, ciudad, codigo_postal }]
  },
  favoritos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
    // Array of Catalog IDs
  }
});
