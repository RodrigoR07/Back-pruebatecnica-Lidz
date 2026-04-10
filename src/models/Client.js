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
}, {
  tableName: 'clients',
  timestamps: false,
});

module.exports = Client;