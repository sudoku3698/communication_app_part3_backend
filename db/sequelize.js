const { Sequelize } = require('sequelize');
const config = require('../db/config'); // Adjust path as needed

const environment = 'development';
const dbConfig = config[environment];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: false, // Set to console.log to enable SQL query logging
});

module.exports = sequelize;