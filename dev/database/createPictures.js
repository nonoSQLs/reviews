const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./postgres/connect.js');
const Faker = require('faker');
const queries = require('./postgres/queries.js');
const Reviews = require('../../database/Reviews.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const reviewsByLanguage = require('./sampleData.js');

const csvPath = `/home/javan/sdc/pictures`;
let run = true;
let k = 0;

async function addPicturesLoop() {
  for(let j = 0; j < 400; j++) {
    if (run) {
      await addPictures(j);
      console.log(`finished with ${j + 1} addDest`);
    } else {
      break
    }
  }
}

async function addPictures(int) {
  var file = csvPath + int + '.csv';
  
  const writePictures = createCsvWriter({
    path: file,
    header: [
      {id: 'picture_id', title: 'picture_id'},
      {id: 'review_id', title: 'review_id'},
      {id: 'destination_id', title: 'destination_id'},
      {id: 'picture_url', title: 'picture_url'},
      {id: 'picture_alt_tag', title: 'picture_alt_tag'}
    ]
  });

  let pictures = [];  

  let count = 100000;
  let start = int * count;

  // if (k != 0) {
  //   k += 1;
  // }
  console.log('starting dest_id: ', start);
  // console.log('review_id: ', k);
  // if (start > 9999999) {
  //   run = false
  // } else {
    for (var i = 0; i < count; i++) {
      // let randNum = Math.floor(Math.random() * 3) + 1;
      // for (var j = 0; j < randNum; j++) {
        let picture = {};
  
        picture["picture_id"] = start + i;
        picture["review_id"] = Math.floor(Math.random() * 20000000);
        picture["destination_id"] = Math.floor(Math.random() * 10000000);
        picture["picture_url"] = `http://d20lp9tw1uk7y6.cloudfront.net/images/tripadvisor_thailand_${Math.floor(Math.random() * 100)}.jpg`;
        picture["picture_alt_tag"] = "travel_pictures";

        pictures.push(picture);
        // k++;
      // }
    }
  // }
  console.log('done creating the reviews arr #: ' + int);
  await writePictures.writeRecords(pictures)
    .catch(err => console.log('createPictures writeRecords error: ', err))
    .then(() => console.log('createPictures writeRecords success!'))
  await queries.insertPicturesCSV(file)
    .catch(err => console.log('createPictures insertReviewsCSV error:', err))
    .then(() => {
      console.log('createPictures insertReviewsCSV success!')
      return
    })
}
(async () => {
  await addPicturesLoop()
    .then(() => {
      console.log('addPictures loop successful!');      
    })
    .catch(err => console.log('addPictures loop successful error: ', err))
})()