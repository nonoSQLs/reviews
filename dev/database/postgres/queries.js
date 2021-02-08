const client = require('./connect.js');


async function insertUsers() {
  await client.connect();
  await client.query(`INSERT INTO users
    VALUES ('LordBigglesworth1','USA','fakeurl.com')`, (err, res) => {
      err ? console.log(err) : console.log('test user inserted successfully');
    client.end();
  });
}

async function insertUsersCSV(path) {
  await client.connect();
  await client.query(`
    COPY users(user_id, user_home_location, user_profile_pic)
    FROM '${path}'
    DELIMITER ','
    CSV HEADER
  `, err => {
    err ? console.log('insertUsersCSV error: ', err) : console.log('pictures table dropped successfully');
    client.end();
  });
}

const getUsers = (cb) => {
  client.connect();
  console.log('in getUsers')
  client.query(`SELECT * FROM users`, (err, data) => {
    if (err) {
      cb(err, null)
    } else {
      cb(null, data.rows)
    }
  })
  
}

// insertUsers();
// insertUsersCSV();

module.exports = {
  insertUsersCSV: insertUsersCSV,
  findAll: getUsers,
};