/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const Faker = require('faker');
const Reviews = require('../../database/Reviews.js');
const db = require('../../database/index');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const reviewsByLanguage = require('./sampleData.js');

const generateData = () => {
  db('reviews');
  fetch('https://randomuser.me/api/?results=5000')
    .then((response) => {
      // console.log(response);
      return response.json();
    })
    .then((fakeUsers) => {
      Reviews.remove((err) => {
        if (err) {
          console.log(Err);
        } else {
          console.log('Database dropped');
        }
      });
      const dummyData = [];
      const destinations = ['Phitsanulok', 'Bangkok', 'Phuket', 'Trang', 'Ayutthaya'];
      const languages = ['english', 'italian', 'spanish', 'french', 'russian'];
      const travelerTypes  = ['families', 'couples', 'solo', 'business', 'friends'];
      console.log(reviewsByLanguage);
      // jp: 
      for (let j = 0; j < destinations.length; j++) {
        for (let i = 0; i < 100; i += 1) {
          const randomImages = [];
          for (let k = 0; k < Math.floor(Math.random() * 6); k++) {
            randomImages.push(`http://d20lp9tw1uk7y6.cloudfront.net/images/tripadvisor_thailand_${Math.floor(Math.random() * 100)}.jpg`)
          }
          const randomTravelerTypes = [];
          for (let type = 0; type < Math.floor(Math.random() * (6 - 1) + 1); type++) {
            randomTravelerTypes.push(travelerTypes[type]);
          }
          let currentLanguage = reviewsByLanguage[languages[j]];
          //google translate is limited to 3900 characters so my foreign language reviews
          //are kind of small so i will add 2 random review bodys together to make a single
          //random review body, i this change will showcase the review filtering better by preventing
          //exact duplicate review bodies
          let fakeReviewBody = currentLanguage[Math.floor(Math.random() * currentLanguage.length)] + currentLanguage[Math.floor(Math.random() * currentLanguage.length)];
          dummyReview = {
            userName: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
            profilePic: `${fakeUsers.results[Math.floor(Math.random() * 5000)].picture.thumbnail}`,
            created_at: Faker.date.past(),
            userHomeLocation: Faker.address.country(),
            images: randomImages,
            starRating: Math.floor(Math.random() * (6 - 1) + 1),
            reviewTitle: Faker.lorem.words(),
            reviewBody: fakeReviewBody,
            dateOfExperience: Faker.date.past(),
            helpfulVotes: Math.floor(Math.random() * (20 - 1) + 1),
            destination: destinations[j],
            language: languages[j],
            travelerType: randomTravelerTypes,
          };
          dummyData.push(dummyReview);
        }
      }

      Reviews.create(dummyData, (err) => {
        if (err) {
          console.log('Err', err);
          mongoose.disconnect();
        } else {
          console.log('Seeding complete');
          mongoose.disconnect();
        }
      });
    })
    .catch((err) => console.log(err));
};

generateData();
