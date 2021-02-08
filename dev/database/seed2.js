/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const Faker = require('faker');
const Reviews = require('../../database/Reviews.js');
const db = require('../../database/index');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const reviewsByLanguage = require('./sampleData.js');
const csv = require('csv-parser');
const fs = require('fs');
const queries = require('./postgres/queries.js');

function getCities() {
  var cities = [];
  return new Promise(resolve => {
    fs.createReadStream('./files/worldcities.csv')
    .pipe(csv())
    .on('data', row => {
      var obj = {}
      obj["city"] = row.city;
      obj["country"] = row.country;
      cities.push(obj);
    })
    .on('end', () => {
      console.log('got cities...');
      resolve(cities);
    })
  })
}

function fetchUsers() {
  return new Promise(resolve => {
    db('reviews');
    fetch('https://randomuser.me/api/?results=5000')
    .then((response) => {
      console.log('received data from randomuser');
      return response.json()
    })
    .then((fakeUsers) => {
      return Reviews.remove((err) => {
        if (err) {
          console.log(Err);
          return null
        } else {
          console.log('Database dropped');
          resolve(fakeUsers);
        }
      });
    })
    .catch(err => resolve(err));
  })
}



async function generateData() {
  const destinations = ['Phitsanulok', 'Bangkok', 'Phuket', 'Trang', 'Ayutthaya'];
  const languages = ['english', 'italian', 'spanish', 'french', 'russian'];
  const travelerTypes  = ['families', 'couples', 'solo', 'business', 'friends'];
  // const fakeUsers = await fetchUsers();
  const cities = await getCities();
  const citiesLen = cities.length - 1;
  
  function getRandomData() {
    const dummyData = [];
    return new Promise(resolve => {
      // for (let j = 0; j < destinations.length; j++) {
        for (let i = 0; i < 100000; i++) {
          // let randomImages = [];
          let lang = languages[Math.floor(Math.random() * 5)]
          // for (let k = 0; k < Math.floor(Math.random() * 6); k++) {
          //   randomImages.push(`http://d20lp9tw1uk7y6.cloudfront.net/images/tripadvisor_thailand_${Math.floor(Math.random() * 100)}.jpg`)
          // }
          let currentLanguage = reviewsByLanguage[lang];
          let fakeReviewBody = currentLanguage[Math.floor(Math.random() * currentLanguage.length)] + currentLanguage[Math.floor(Math.random() * currentLanguage.length)];
          dummyReview = {
            // userName: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
            // profilePic: `${fakeUsers.results[Math.floor(Math.random() * 5000)].picture.thumbnail}`,
            created_at: Faker.date.past(),
            // userHomeLocation: Faker.address.country(),
            images: randomImages,
            starRating: Math.floor(Math.random() * (6 - 1) + 1),
            reviewTitle: Faker.lorem.words(),
            reviewBody: fakeReviewBody,
            dateOfExperience: Faker.date.past(),
            helpfulVotes: Math.floor(Math.random() * (20 - 1) + 1),
            destination: cities[Math.floor(Math.random() * citiesLen)]["city"],
            language: lang,
            // travelerType: randomTravelerTypes,
            travelerType: travelerTypes[Math.floor(Math.random() * 5)]
          };
          dummyData.push(dummyReview);
        }
      // }
      resolve(dummyData);
    })
  }
  let data = await getRandomData();
  return data;
  // const limit = 1000000
  // const citiesLen = cities.length - 1;
  // let cityCount = 0;
  // let data = [];
  // for (var i = 0; i < limit; i++) {
  //   // let's try to do 100,000 random values at a time and push them to 
  //   // cityCount < citiesLen ? cityCount = cityCount + 1 : cityCount = 0;
  // }


  // const dummyData2 = await getRandomData();
  // console.log('dummyData2 length', dummyData2.length);
  // console.log('sample: ', dummyData2[2003]);

  // mongoose.disconnect();

  // Reviews.create(dummyData2, (err) => {
  //   if (err) {
  //     console.log('Err', err);
  //     mongoose.disconnect();
  //   } else {
  //     console.log('...Seeding complete');
  //     mongoose.disconnect();
  //   }
  // });

};

// generateData();

module.exports = {
  getDestinations: generateData, 
  getCities: getCities,
  // more functions as needed
}