const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./postgres/connect.js');
const Faker = require('faker');
const queries = require('./postgres/queries.js');
const Reviews = require('../../database/Reviews.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const reviewsByLanguage = require('./sampleData.js');
// const tables = require('./postgres/createTables.js');


// const createFiles = function() {
//   let array = [];
//   for (var i = 0; i < 10; i++) {
//     array.push(`/home/javan/sdc/dest${i}.csv`)
//   }
//   return array
// }
// let files = createFiles();
// console.log('files: ', files);

// this will likely be called in from createDestinations, to populate 4 reviews for every destination in the clumbs of 1 million destinations created
  // instead we're going to open up one of the csv files and create our 4 million reviews from each one
    // and then delete the destinations and review csv files

// first step, open up csv file
  // maybe we'll create an array of the files we created in createDestinations and send them over here

// ... wait... I DON'T HAVE TO USE THOSE FILES AT ALL
  // all we need is the destination id numbers, which we know are 0 - 9999999

// ok how's about we do 20 million reviews and 40 million pictures

// let's loop through 1 - 1 million (which will be our destination IDs) 
  // create 2 reviews for each one
    // or maybe randomize 1 - 4

const csvPath = `/home/javan/sdc/reviews`;


async function addReviewsLoop() {
  for(let j = 0; j < 2; j++) {
    await addReviews(j);
    console.log(`finished with ${j + 1} addDest`);
  }
}

let k = 0;

async function addReviews(int) {
  var file = csvPath + int + '.csv';
  // files.push(file);
  
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
  let count = 100;
  let reviews = [];  
  let start = int * count;
  console.log('int: ', int);
  console.log('start: ', start);

  for (var i = 0; i < count; i++) {
    let randNum = Math.floor(Math.random() * 4) + 1;
    for (var j = 0; j < randNum; j++) {
      let review = {};
      let lang = languages[Math.floor(Math.random() * 5)];
      let currentLanguage = reviewsByLanguage[lang];
      let fakeReviewBody = currentLanguage[Math.floor(Math.random() * currentLanguage.length)] + currentLanguage[Math.floor(Math.random() * currentLanguage.length)];

      console.log('start + k: ', start + k);
      review["review_id"] = start + k;
      console.log('review_id: ', review.review_id)
      review["destination_id"] = start + i;
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
      k = k + 1;
    }
  }
  // console.log(reviews);
  await writeReviews.writeRecords(reviews)
    .catch(err => console.log('createReviews writeRecords error: ', err))
    .then(() => console.log('createReviews writeRecords success!'))
  await queries.insertReviewsCSV(file)
    .catch(err => console.log('createReviews insertReviewsCSV error:', err))
    .then(() => console.log('createReviews insertReviewsCSV success!'))
  return
}

(async () => {
  await addReviewsLoop()
    .then(() => {
      console.log('addReviews loop successful!');      
    })
    .catch(err => console.log('addReviews loop successful error: ', err))
  // tables.dropReviews()
  //   .then(() => {
  //     console.log('reviewTables dropped...')
  //     tables.createReviews()
  //       .then(() => {
  //         console.log('reviewTables created...')
  //         addReviewsLoop()
  //           .then(() => {
  //             console.log('addReviews loop successful!');      
  //           })
  //           .catch(err => console.log('addReviews loop error: ', err))
  //       })
  //       .catch(err => console.log('error creating reviewTables: ', err))
  //   })
  //   .catch(err => console.log('createReviews drop reviews error: ', err))

  // console.log('reviews table dropped')
  // await tables.createReviews()
  // console.log('reviews table created')
  // blocking these out because the function itself has pretty decent error handling
  // .then(() => console.log('reviewTables dropped...'))
  // .catch(err => console.log('createDestinations.js err in await for getCities'))
  // await getCities()
  //   .then(() => console.log('createDestinations.js getCities finished...'))
  //   .catch(err => console.log('createDestinations.js err in await for getCities'))
  // console.log('cities finished...');
  // await getCountries()
  //   .then(() => console.log('createDestinations.js getCountries finished...'))
  //   .catch(err => console.log('createDestinations.js err in await for getCountries'))
  // console.log('countries finished...');


  // perhaps initiate the call over to createReviews and send the filepaths that we just created ("files")
})()

// console.log('reviews: ', reviews);
