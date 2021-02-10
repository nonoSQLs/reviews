/* eslint-disable react/no-unused-state */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import ReviewListControls from './ReviewListControls';
import SearchBar from './SearchBar';
import ReviewList from './ReviewList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      travelerRatings: {},
      currentPage: 0,
      loaded: false,
      reviewsBodyFilter: '',
      reviewsTravelerTypeFilter: [],
      reviewsTimeOfYearFilter: [],
      reviewsLanguageFilter: null,
      reviewsRatingFilter: null,
    };
    this.helpfulClickHandler = this.helpfulClickHandler.bind(this);
    this.handleClickClearInput = this.handleClickClearInput.bind(this);
    this.handleChangeFilterBody = this.handleChangeFilterBody.bind(this);
    this.writeReview = this.writeReview.bind(this);
    this.handleChangeFilterTravelerType = this.handleChangeFilterTravelerType.bind(this);
    this.handleChangeFilterLanguage = this.handleChangeFilterLanguage.bind(this);
    this.handleChangeFilterTimeOfYear = this.handleChangeFilterTimeOfYear.bind(this);
    this.handleChangeRatingFilter = this.handleChangeRatingFilter.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleClickClearInput() {
    this.setState({ reviewsBodyFilter: [] });
  }

  handleChangeFilterBody(searchInput) {
    this.setState({ reviewsBodyFilter: searchInput });
  }

  handleChangeFilterTravelerType(types) {
    if (types.length === 0) {
      this.setState({ reviewsTravelerTypeFilter: [] });
    } else {
      this.setState({ reviewsTravelerTypeFilter: types });
    }
  }

  handleChangeFilterTimeOfYear(timeOfYear) {
    if (timeOfYear.length === 0) {
      this.setState({ reviewsTimeOfYearFilter: ['marMay', 'junAug', 'sepNov', 'decFeb'] });
    } else {
      this.setState({ reviewsTimeOfYearFilter: timeOfYear });
    }
  }

  handleChangeFilterLanguage(language) {
    if (language !== 'all') {
      this.setState({ reviewsLanguageFilter: language });
    } else {
      this.setState({ reviewsLanguageFilter: null });
    }
  }

  handleChangeRatingFilter(rating) {
    if (rating.length > 0) {
      this.setState({ reviewsRatingFilter: rating });
    } else {
      this.setState({ reviewsRatingFilter: [] });
    }
  }

  getData() {
    // in the future this would get reviews by location
    // but that would require outside assistance from another service
    // to know which location to grab
    axios.get('/api/reviews/')
      .then((res) => {
        this.setState({ reviews: res.data });
        let myReview = this.state.reviews.filter(review => review.reviewBody === 'Hello world');
        console.log('my review', myReview);
        console.log(res.data);
        this.populateRatingsAndPages();
      })
      .catch((err) => console.log(err));
  }

  getReviews(pageNumber) {
    const start = pageNumber * 10 - 10;
    const end = pageNumber * 10;
    const filteredReviews = this.filterReviews();
    if (pageNumber === 0) {
      return { reviewsToRender: filteredReviews.slice(0, 10), allReviews: filteredReviews };
    }
    return { reviewsToRender: filteredReviews.slice(start, end), allReviews: filteredReviews };
  }

  filterReviews() {
    const {
      reviews,
      reviewsBodyFilter,
      reviewsLanguageFilter,
      reviewsTravelerTypeFilter,
    } = this.state;
    const applyAllFilters = () => {
      const filteredReviews = reviews.filter((review) => {
        if (review.reviewBody.includes(reviewsBodyFilter)) {
          return review;
        }
        if (reviewsBodyFilter === '') {
          return review;
        }
      }).filter((review) => {
        if (review.language === reviewsLanguageFilter) {
          return review;
        }
        if (reviewsLanguageFilter === null) {
          return review;
        }
      }).filter((review) => {
        let pass = false;
        for (let i = 0; i < reviewsTravelerTypeFilter.length; i += 1) {
          if (review.travelerType.includes(reviewsTravelerTypeFilter[i])) {
            pass = true;
            break;
          }
        }
        if (pass) {
          return review;
        }
        if (reviewsTravelerTypeFilter.length === 0) {
          return review;
        }
      });
      return filteredReviews;
    };

    return applyAllFilters();
  }

  helpfulClickHandler(e) {
    const id = e.target.getAttribute('data-id');
    axios.patch(`/api/reviews/${id}`)
      .then(() => {
        this.getData();
      })
      .catch((err) => console.log(err));
  }

  populateRatingsAndPages() {
    const { reviews } = this.state;
    // const { length } = reviews;
    // const pages = Math.ceil(length / 10);
    const ratings = reviews.reduce((acc, currentValue) => (
      acc.concat([currentValue.starRating])
    ), []);

    const ratingDefinitions = {
      5: 'excellent',
      4: 'good',
      3: 'average',
      2: 'poor',
      1: 'terrible',
    };

    const travelerRatings = ratings.reduce((acc, currentValue) => {
      if (acc[ratingDefinitions[String(currentValue)]] === undefined) {
        acc[ratingDefinitions[String(currentValue)]] = 1;
      } else {
        acc[ratingDefinitions[String(currentValue)]] += 1;
      }
      return acc;
    }, {});
    const loaded = true;
    this.setState({ travelerRatings, loaded });
  }

  writeReview() {
    const review = {};
    review.userName = document.getElementById('nameInput').value;
    review.reviewTitle = document.getElementById('titleInput').value;
    review.reviewBody = document.getElementById('bodyInput').value;
    review.userHomeLocation = document.getElementById('homeInput').value;
    review.starRating = Number(document.getElementById('hiddenInput').value);
    // review.dateOfExperience = document.getElementById('whenInput');
    review.dateOfExperience = Date.now();
    review.destination = 'Bangkok';
    review.images = [];
    axios.post('/api/reviews', review)
      .then((res) => {
        console.log(res);
        this.getData();
      })
      .catch((err) => console.log(err));
  }

  renderView() {
    const {
      reviews, travelerRatings, loaded, currentPage,
    } = this.state;

    const filteredReviews = this.getReviews(currentPage);
    const reviewsCount = filteredReviews.allReviews.length;
    if (reviews.length > 0 && loaded) {
      return (
        <>
          <ReviewListControls
            writeReview={this.writeReview}
            travelerRatings={travelerRatings}
            reviewsCount={reviewsCount}
            handleChangeFilterTravelerType={this.handleChangeFilterTravelerType}
            handleChangeFilterTimeOfYear={this.handleChangeFilterTimeOfYear}
            handleChangeFilterLanguage={this.handleChangeFilterLanguage}
            handleChangeRatingFilter={this.handleChangeRatingFilter}
          />
          <Divider />
          <SearchBar
            handleChangeFilterReviews={this.handleChangeFilterBody}
            handleClickClearInput={this.handleClickClearInput}
          />
          <ReviewList
            helpfulClickHandler={this.helpfulClickHandler}
            reviewsToRender={filteredReviews.reviewsToRender}
            pages={filteredReviews.allReviews.length}
          />
        </>
      );
    }
    return <p>Loading...</p>;
  }

  render() {
    return (
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={6}>
          {this.renderView()}
        </Grid>
      </Grid>
    );
  }
}

export default App;
