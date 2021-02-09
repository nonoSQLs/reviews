
const { Pool, Client } = require('pg')

const client = new Client({
  user: 'javanp',
  host: 'localhost',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
})

client.connect()

client.query(`DROP TABLE IF EXISTS pictures`, (err, res) => {
  err ? console.log(err) : console.log('pictures table dropped successfully');
})

client.query(`DROP TABLE IF EXISTS reviews`, (err, res) => {
  err ? console.log(err) : console.log('reviews table dropped successfully');
})

client.query(`DROP TABLE IF EXISTS destinations`, (err, res) => {
  err ? console.log(err) : console.log('destinations table dropped successfully');
})

client.query(`DROP TABLE IF EXISTS users`, (err, res) => {
  err ? console.log(err) : console.log('users table dropped successfully');
})

async function destinations() {
  await client.query(`CREATE TABLE destinations (
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
  await client.query(`CREATE TABLE users (
    user_id VARCHAR(20) UNIQUE,
    user_home_location VARCHAR(20),
    user_profile_pic VARCHAR(100),
    PRIMARY KEY(user_id)
  )`, (err, res) => {
    err ? console.log(err) : console.log('users table created successfully');
  })
}

async function reviews() {
  await client.query(`CREATE TABLE reviews (
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
  PRIMARY KEY(review_id),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
      REFERENCES users(user_id),
  CONSTRAINT fk_destination
    FOREIGN KEY (destination_id)
      REFERENCES destinations(destination_id)
   )`, (err, res) => {
    err ? console.log(err) : console.log('reviews table created successfully');
  })
}

async function pictures() {
  await client.query(`CREATE TABLE pictures (
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
  client.end();
  })
}

destinations();
users();
reviews();
pictures();

