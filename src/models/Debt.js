const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./Client');

const Debt = sequelize.define('Debt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'debts',
  timestamps: false,
});

// Relation: One Client has many Debts, a Debt belongs to one Client
Client.hasMany(Debt, { foreignKey: 'clientId', onDelete: 'CASCADE' });
Debt.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = Debt;