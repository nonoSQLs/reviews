const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./postgres/connect.js');
const Faker = require('faker');
const queries = require('./postgres/queries.js');
const Reviews = require('../../database/Reviews.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const reviewsByLanguage = require('./sampleData.js');
// const tables = require('./postgres/createTables.js');

const csvPath = `/home/javan/sdc/reviews`;
let run = true;
let k = 0;

async function addReviewsLoop() {
  for(let j = 0; j < 100; j++) {
    if (run) {
      await addReviews(j);
      console.log(`finished with ${j + 1} addDest`);
    } else {
      break
    }
  }
}

async function addReviews(int) {
  var file = csvPath + int + '.csv';
  
  const writeReviews = createCsvWriter({
    path: file,
    header: [
      {id: 'review_id', title: 'review_id'},
      {id: 'destination_id', title: 'destination_id'},
      {id: 'user_id', title: 'user_id'},
      {id: 'review_date_created', title: 'review_date_created'},
      {id: 'date_experience_start', title: 'date_experience_start'},
      {id: 'date_exeperience_end', title: 'date_exeperience_end'},
      {id: 'review_helpful_votes', title: 'review_helpful_votes'},
      {id: 'review_traveler_type', title: 'review_traveler_type'},
      {id: 'review_title', title: 'dereview_titletination_name'},
      {id: 'reivew_body', title: 'destination_country_name'},
      {id: 'review_rating', title: 'review_rating'},
      {id: 'review_views', title: 'review_views'},
      {id: 'review_language', title: 'review_language'},
    ]
  });

  const languages = ['english', 'italian', 'spanish', 'french', 'russian'];
  const travelerTypes  = ['families', 'couples', 'solo', 'business', 'friends'];
  let count = 100000;
  let reviews = [];  
  let start = int * count;

  console.log('starting dest_id: ', start);
  console.log('review_id: ', k);
  if (start > 9999999) {
    run = false
  } else {
    for (var i = 0; i < count; i++) {
      let randNum = Math.floor(Math.random() * 3) + 2;
      for (var j = 0; j < randNum; j++) {
        let review = {};
        let dest_id = start + i;
        
        let lang = languages[Math.floor(Math.random() * 5)];
        let currentLanguage = reviewsByLanguage[lang];
        let fakeReviewBody = currentLanguage[Math.floor(Math.random() * currentLanguage.length)] + currentLanguage[Math.floor(Math.random() * currentLanguage.length)];
  
        review["review_id"] = start + k;
        review["destination_id"] = dest_id;
        review["user_id"] = Math.floor(Math.random() * 4999) + 1;
        review["review_date_created"] = `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 20) + 2000}`;
        review["date_experience_start"] = `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 20) + 2000}`;
        review["date_exeperience_end"] = `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 20) + 2000}`;
        review["review_helpful_votes"] = Math.floor(Math.random() * 24) + 1;
        review["review_traveler_type"] = travelerTypes[Math.floor(Math.random() * 5)];
        review["review_title"] = Faker.lorem.words()
        review["reivew_body"] = fakeReviewBody;
        review["review_rating"] = Math.floor(Math.random() * 5) + 1;
        review["review_views"] = Math.floor(Math.random() * 400) + 100;
        review["review_language"] = lang;
        reviews.push(review);
        k++;
      }
    }
  }
  console.log('done creating the reviews arr #: ' + int);
  await writeReviews.writeRecords(reviews)
    .catch(err => console.log('createReviews writeRecords error: ', err))
    .then(() => console.log('createReviews writeRecords success!'))
  await queries.insertReviewsCSV(file)
    .catch(err => console.log('createReviews insertReviewsCSV error:', err))
    .then(() => {
      console.log('createReviews insertReviewsCSV success!')
      return
    })
}

(async () => {
  await addReviewsLoop()
    .then(() => {
      console.log('addReviews loop successful!');      
    })
    .catch(err => console.log('addReviews loop successful error: ', err))
})()

