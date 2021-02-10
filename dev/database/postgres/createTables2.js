const pool = require('./connect.js');

// const { Pool, Client } = require('pg')

// const client = new Client({
//   user: 'javanp',
//   host: 'localhost',
//   database: 'mydatabase',
//   password: 'password',
//   port: 5432,
// })

// client.connect()


// async function dropReviews() {
//   pool.connect()
//     .then(client => {
//       return client
//         .query(`DROP TABLE IF EXISTS reviews`)
//         .then(() => {
//           client.release()
//           console.log('reviews table dropped successfully')
//         })
//         .catch(err => {
//           client.release()
//           console.log('drop Review Table error: ', err)
//         })
//     })
//     .catch(err => console.log('createTables dropReviews: pool connection error: ', err))
// }

pool.query(`DROP TABLE IF EXISTS pictures`, (err, res) => {
  err ? console.log(err) : console.log('pictures table dropped successfully');
})

pool.query(`DROP TABLE IF EXISTS users`, (err, res) => {
  err ? console.log(err) : console.log('users table dropped successfully');
})

pool.query(`DROP TABLE IF EXISTS reviews`, (err, res) => {
  err ? console.log(err) : console.log('reviews table dropped successfully');
})

pool.query(`DROP TABLE IF EXISTS destinations`, (err, res) => {
  err ? console.log(err) : console.log('destinations table dropped successfully');
})

async function destinations() {
  await pool.query(`CREATE TABLE destinations (
  destination_id INT UNIQUE,
  destination_name VARCHAR(100),
  destination_country_name VARCHAR(100),
  avg_rating NUMERIC(1,1),
  PRIMARY KEY(destination_id)
   )`, (err, res) => {
    err ? console.log(err) : console.log('destinations table created successfully');
  })
}

async function users() {
  await pool.query(`CREATE TABLE users (
    user_id VARCHAR(20) UNIQUE,
    user_home_location VARCHAR(20),
    user_profile_pic VARCHAR(100),
    PRIMARY KEY(user_id)
  )`, (err, res) => {
    err ? console.log(err) : console.log('users table created successfully');
  })
}

async function reviews() {
  pool.connect()
    .then(client => {
      return client
        .query(`CREATE TABLE reviews (
          review_id INT UNIQUE,
          destination_id SMALLINT,
          user_id VARCHAR(20),
          review_date_created TIMESTAMP,
          date_experience_start DATE,
          date_exeperience_end DATE,
          review_helpful_votes INT,
          review_traveler_type VARCHAR(10),
          review_title VARCHAR(20),
          reivew_body VARCHAR(5000),
          review_rating BIT,
          review_views INT,
          review_language VARCHAR(30),
          PRIMARY KEY(review_id),
          CONSTRAINT fk_user
            FOREIGN KEY (user_id)
              REFERENCES users(user_id),
          CONSTRAINT fk_destination
            FOREIGN KEY (destination_id)
              REFERENCES destinations(destination_id)
           )`)
          .then(() => {
            client.release()
            console.log('reviews table created successfully')
          })
          .catch(err => {
            client.release()
            console.log('reviews table create ERROR: ', err)
          })
    })
    .catch(err => console.log('createTables reviews: pool connection error: ', err))
}

async function pictures() {
  await pool.query(`CREATE TABLE pictures (
  picture_id SMALLINT PRIMARY KEY,
  review_id INT,
  destination_id SMALLINT,
  picture_url VARCHAR(30),
  picture_alt_tag CHAR(20),
  CONSTRAINT fk_review
    FOREIGN KEY (review_id)
      REFERENCES reviews(review_id),
  CONSTRAINT fk_destination
    FOREIGN KEY (destination_id)
      REFERENCES destinations(destination_id)
   )`, (err, res) => {
    err ? console.log(err) : console.log('pictures table created successfully');
  pool.end();
  })
}

destinations();
users();
reviews();
pictures();

// module.exports = {
//   dropReviews: dropReviews,
//   createReviews: reviews
// }