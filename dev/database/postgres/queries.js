const pool = require('./connect.js');
const fs = require('fs');


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
  await pool.end();
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
          fs.unlink(path, err => {
            if (err) {
              console.log('fs.unlink error for file' + path, err) 
            }
          })
        })
        .catch(err => {
          client.release()
          console.log('insertUsersCSV error: ', err)
        })
    })
    .catch(err => console.log('queries: insertDestsCSV, pool connection error'))
}

async function insertPicturesCSV(path) {
  pool.connect()
    .then(client => {
      console.log('pool connected...');
      return client
        .query(`
          COPY pictures(picture_id, review_id, destination_id, picture_url, picture_alt_tag)
          FROM '${path}'
          DELIMITER ','
          CSV HEADER`)
        .then(() => {
          client.release()
          console.log('pictures successfully inserted into db')
          fs.unlink(path, err => {
            if (err) {
              console.log('fs.unlink error for file' + path, err) 
            }
          })
        })
        .catch(err => {
          client.release()
          console.log('insertPicturesCSV error: ', err)
        })
    })
    .catch(err => console.log('queries: insertPicturesCSV, pool connection error'))
}

async function insertReviewsCSV(path) {
  pool.connect()
    .then(client => {
      console.log('pool connected...');
      return client
        .query(`
          COPY reviews(review_id, destination_id, user_id, review_date_created, date_experience_start, date_exeperience_end, review_helpful_votes, review_traveler_type, review_title, reivew_body, review_rating, review_views, review_language)
          FROM '${path}'
          DELIMITER ','
          CSV HEADER`)
        .then(() => {
          client.release()
          console.log('reviews successfully inserted into db')
          // fs.unlink(path, err => {
          //   if (err) {
          //     console.log('fs.unlink error for file' + path, err) 
          //   }
          // })
        })
        .catch(err => {
          client.release()
          console.log('insertReviewsCSV error: ', err)
        })
    })
    .catch(err => console.log('queries: insertReviewsCSV, pool connection error: ', err))
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
  insertReviewsCSV: insertReviewsCSV,
  insertPicturesCSV: insertPicturesCSV
};