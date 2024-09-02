// config.js
module.exports = {
    development: {
     "username": process.env.DEV_DB_USER,
     "password": process.env.DEV_DB_PASSWORD,
     "database": process.env.DEV_DB_NAME,
     "host": process.env.DEV_DB_HOST,
     "dialect": process.env.DEV_DB_DIALECT,
     "port": process.env.DEV_DB_PORT
    },
    test: {
      "username": process.env.TEST_DB_USER,
      "password": process.env.TEST_DB_PASSWORD,
      "database": process.env.TEST_DB_NAME,
      "host": process.env.TEST_DB_HOST,
      "dialect": process.env.TEST_DB_DIALECT,
      "port": process.env.TEST_DB_PORT
    },
    production: {
      "username": process.env.PROD_DB_USER,
      "password": process.env.PROD_DB_PASSWORD,
      "database": process.env.PROD_DB_NAME,
      "host": process.env.PROD_DB_HOST,
      "dialect": process.env.PROD_DB_DIALECT,
      "port": process.env.PROD_DB_PORT
    }
  };
  