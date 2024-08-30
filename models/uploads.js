// models/uploads.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Adjust path as needed

const Uploads = sequelize.define('Uploads', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'uploads',
  timestamps: false,
  defaultValue: () => new Date()
});

Uploads.sync({ alter: true });
module.exports = Uploads;

