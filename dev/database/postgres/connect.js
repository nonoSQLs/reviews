const { Pool, Client } = require('pg')

const client = new Client({
  user: 'javanp',
  host: 'localhost',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
})

module.exports = client;