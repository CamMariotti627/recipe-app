require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'recipe_app_db',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

module.exports = pool;

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection error:', err);
    } else {
        console.log('Connected to Render DB! Current time:', res.rows[0]);
    }
});