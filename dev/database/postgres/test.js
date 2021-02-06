const { Pool, Client } = require('pg')

const client = new Client({
  user: 'javanp',
  host: 'localhost',
  database: 'mydatabase',
  password: 'biggles82',
  port: 5432,
})


async function insertUsers() {
  await client.connect();
  await client.query(`INSERT INTO users
    VALUES ('LordBigglesworth1','USA','fakeurl.com')`, (err, res) => {
    console.log(err, res);
    client.end();
  });
}

insertUsers();