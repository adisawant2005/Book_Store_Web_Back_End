const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "postgre",
  host: "localhost",
  port: 5432,
  database: "book_store",
});

module.exports = pool;
