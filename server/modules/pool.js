const pg = require('pg');
require('dotenv').config()

/*
// Local Host or Heroku Postgres Database connectionString
const pool = new pg.Pool({
    label: 'SQL To Do List',
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000
});
*/

// Local Host Postgres Database
const pool = new pg.Pool({
    host: 'localhost',
    database: 'weekend-to-do-app',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000
});

module.exports = pool;