
const { Pool, Client } = require('pg')

const client = new Client({
  user: 'javanp',
  host: 'localhost',
  database: 'mydatabase',
  password: 'biggles82',
  port: 5432,
})

client.connect()

client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})

// const pool = new Pool({
//   user: 'javanp',
//   host: 'localhost',
//   database: 'mydatabase',
//   password: 'biggles82',
//   port: 5432,
// })

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// async function postG() {
//   // const { Client } = require('pg')
//   // const client = new Client()
//   // await client.connect()
//   // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
//   // console.log(res.rows[0].message) // Hello world!
//   // await client.end()

// // pools will use environment variables
// // for connection information
//   const pool = new Pool()
//   pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     pool.end()
//   })
//   // you can also use async/await
//   const res = await pool.query('SELECT NOW()')
//   await pool.end()
//   // clients will also use environment variables
//   // for connection information
//   const client = new Client()
//   await client.connect()
//   const res2 = await client.query('SELECT NOW()')
//   await client.end()

// }

// postG();