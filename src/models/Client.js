const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rut: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  savings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  credit_history_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  purchaseMotivation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  propertyType: {
    type: DataTypes.ENUM('casa', 'departamento'),
    allowNull: true,
  },
  preferredLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  propertySize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  urgencyLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  purchaseType: {
    type: DataTypes.ENUM('arriendo', 'compra_pie', 'compra_contado'),
    allowNull: true,
  },
}, {
  tableName: 'clients',
  timestamps: false,
});

module.exports = Client;