const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the connection with a simple query
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Failed to connect to PostgreSQL:', err);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

module.exports = pool;
