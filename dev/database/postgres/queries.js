const pool = require('./connect.js');


async function insertUsers() {
  await pool.connect();
  await pool.query(`INSERT INTO users
    VALUES ('LordBigglesworth1','USA','fakeurl.com')`, (err, res) => {
      err ? console.log(err) : console.log('test user inserted successfully');
    pool.end();
  });
}

async function insertUsersCSV(path) {
  // await pool.connect();
  await pool.query(`
    COPY users(user_id, user_home_location, user_profile_pic)
    FROM '${path}'
    DELIMITER ','
    CSV HEADER
  `, err => {
    err ? console.log('insertUsersCSV error: ', err) : console.log('users successfully inserted into db');
    return
  });
  // await pool.end();
}

async function insertDestsCSV(path) {
  pool.connect()
    .then(client => {
      console.log('pool connected...');
      return client
        .query(`
          COPY destinations(destination_id, destination_name, destination_country_name)
          FROM '${path}'
          DELIMITER ','
          CSV HEADER`)
        .then(() => {
          client.release()
          console.log('destinations successfully inserted into db')
        })
        .catch(err => {
          client.release()
          console.log('insertUsersCSV error: ', err)
        })
    })
    .catch(err => console.log('pool connection error'))

  // await pool.query(`
  //   COPY destinations(destination_id, destination_name, destination_country_name)
  //   FROM '${path}'
  //   DELIMITER ','
  //   CSV HEADER
  // `, err => {
  //   err ? console.log('insertUsersCSV error: ', err) : console.log('destinations successfully inserted into db');
  //   // pool.end();
  // });
  // console.log('out of queries insertDestCSV...')
  // return

  // return pool
  //   .query(`
  //     COPY destinations(destination_id, destination_name, destination_country_name)
  //     FROM '${path}'
  //     DELIMITER ','
  //     CSV HEADER`)
  //   .then(() => console.log('destinations successfully inserted into db'))
  //   .catch(err => console.log('insertUsersCSV error: ', err))
  // console.log('out of queries insertDestCSV...')
}

const getUsers = (cb) => {
  pool.connect();
  console.log('in getUsers')
  pool.query(`SELECT * FROM users`, (err, data) => {
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
  insertDestsCSV: insertDestsCSV,
};