const pg = require('pg');

const pool = new pg.Pool({
    host: 'localhost',
    database: 'weekend-to-do-app',
    port: 5432,
    max: 12,
    idleTimeoutMillis: 30000
});

module.exports = pool;