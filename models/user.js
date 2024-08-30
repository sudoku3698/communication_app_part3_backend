// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize'); // Adjust path as needed

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false,
  defaultValue: () => new Date()
});

User.sync({ alter: true });
module.exports = User;

