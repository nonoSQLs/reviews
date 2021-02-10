const express = require('express');
// const Reviews = require('../database/Reviews.js');
const Reviews = require('../dev/database/postgres/queries.js');


const router = express.Router();

// router.get('/', (req, res) => {
//   console.log('in routes get')
//   Reviews.findAll((err, data) => {
//     if (err) {
//       res.status(404).send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });

// router.get('/:location', (req, res) => {
//   Reviews.findByDestination(req.params.location, (err, data) => {
//     if (err) {
//       res.send(err);
//     } else {
//       console.log(data);
//       res.send(data);
//     }
//   });
// });

router.get('/:location', (req, res) => {
  Reviews.getReviews(res, req.params.location)
});

router.post('/', (req, res) => {
  const newReview = {
    userName: req.body.userName,
    profilePic: req.body.profilePic,
    created_at: Date.now(),
    userHomeLocation: req.body.userHomeLocation,
    images: req.body.images,
    starRating: req.body.starRating,
    reviewTitle: req.body.reviewTitle,
    reviewBody: req.body.reviewBody,
    dateOfExperience: req.body.dateOfExperience,
    helpfulVotes: 0,
    destination: req.body.destination,
  };
  Reviews.create(newReview, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

router.patch('/:id', (req, res) => {
  Reviews.incHelpfulCounter(req.params.id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
