const { Pool, Client } = require('pg')

// const client = new Client({
//   user: 'javanp',
//   host: 'localhost',
//   database: 'mydatabase',
//   password: 'password',
//   port: 5432,
// })

// was getting an error saying the client connection was still open so trying pool per a recommendation from the interwebz
const pool = new Pool({
  user: 'javanp',
  host: 'localhost',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = pool;