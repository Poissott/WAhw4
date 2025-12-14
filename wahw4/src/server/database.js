const Pool = require('pg').Pool;

const pool = new Pool({
    user: "wahw4",
    password: "nmnmnm8bnbnbn",
    database: "wahw4db",
    host: "localhost",
    port: "5432"
});

module.exports = pool;