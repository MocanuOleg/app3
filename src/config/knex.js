require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
  pool: { min: 0, max: 50 }
});

module.exports = db;