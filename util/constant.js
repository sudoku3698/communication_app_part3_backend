const secretKey = 'your-secret-key';
const databaseConfig={
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
}

module.exports = {
    secretKey,
    databaseConfig
}