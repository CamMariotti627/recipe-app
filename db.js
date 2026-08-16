require('dotenv').config();
const { Pool } = require('pg');

//- if DATABASE_URL exists (render) use it directly
// otherwise, fallback to local connection

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: false}
    })
    : new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'recipe_app_db',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

module.exports = pool;
