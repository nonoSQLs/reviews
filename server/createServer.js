const express = require('express');
const parser = require('body-parser');
const routes = require('./reviewRoutes');
const cors = require('cors');
// const db = require('../database/index');

function createServer(dbName) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));
  app.use(parser());
  app.use('/api/reviews', routes);
  // db(dbName);
  return app;
}

module.exports = createServer;
