// models/chat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Adjust path as needed

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: () => new Date()
  }
}, {
  tableName: 'chats',
  timestamps: false
});

Chat.sync({ alter: true });
module.exports = Chat;

