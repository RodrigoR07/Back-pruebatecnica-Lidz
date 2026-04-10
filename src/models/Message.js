const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./Client');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('client', 'agent'),
    allowNull: false,
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'messages',
  timestamps: false,
});

// Relation: One Client has many Messages, a Message belongs to one Client
Client.hasMany(Message, { foreignKey: 'clientId', onDelete: 'CASCADE' });
Message.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = Message;