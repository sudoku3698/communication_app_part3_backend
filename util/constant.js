const secretKey = 'your-secret-key';
const databaseConfig={
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'dashboard',
    schema: 'communication'
}

module.exports = {
    secretKey,
    databaseConfig
}