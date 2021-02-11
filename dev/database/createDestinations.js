const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const queries = require('./postgres/queries.js');
const fs = require('fs');
const csv = require('csv-parser');
const client = require('./postgres/connect.js');

const csvPath = `/home/javan/sdc/dest`;

var cities = [];
let countries = [];
let files = [];

async function getCities() {
  return new Promise(resolve => {
    fs.createReadStream(__dirname + '/files/worldcities.csv')
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

async function getCountries() {
  let countryObj = {}
  await cities.forEach((val) => {
    if (!countryObj[val.country]) {
      countryObj[val.country] = val.country;
    }
  })
  for (var country in countryObj) {
    countries.push(country);
  }
  return
}

async function addDestLoop() {
  for(var j = 0; j < 10; j++) {
    await addDests(j);
    console.log(`finished with ${j + 1} addDest`);
  }
}

async function addDests(int) {
  var file = csvPath + int + '.csv';
  files.push(file);
  
  const writeDests = createCsvWriter({
    path: file,
    header: [
      {id: 'destId', title: 'destination_id'},
      {id: 'destName', title: 'destination_name'},
      {id: 'destCountry', title: 'destination_country_name'}
      // {id: 'avgRating', title: 'avg_rating'}    
    ]
  });

  let counter = 1000000;
  let arr = [];
  let start = int * counter;
  let cityCount = 0;
  let countryCount = 0;
  let cityLen = cities.length - 1;
  let countryLen = countries.length - 1;

  for (let i = 0; i < counter; i++) {
    let dest = {};
    dest["destId"] = start + i;
    dest["destName"] = cities[cityCount].city;
    dest["destCountry"] = countries[countryCount];
    arr.push(dest);
    cityCount < cityLen ? cityCount++ : cityCount = 0;
    countryCount < countryLen ? countryCount++ : countryCount = 0;
  }

  await writeDests.writeRecords(arr)
    .catch(err => console.log('createDestinations writeRecords error: ', err))
    .then(() => console.log('createDestinations writeRecords success!'))
  await queries.insertDestsCSV(file)
    .catch(err => console.log('createDestinations insertUsersCSV error:', err))
    .then(() => {
      console.log('createDestinations insertUsersCSV success!')
    })
  return
}

(async () => {
  await getCities()
    .then(() => console.log('createDestinations.js getCities finished...'))
    .catch(err => console.log('createDestinations.js err in await for getCities'))
  console.log('cities finished...');
  await getCountries()
    .then(() => console.log('createDestinations.js getCountries finished...'))
    .catch(err => console.log('createDestinations.js err in await for getCountries'))
  console.log('countries finished...');
  await addDestLoop()
    .then(() => {
      console.log('addDests loop successful!');      
    })
    .catch(err => console.log('addDests loop successful error: ', err))
  // perhaps initiate the call over to createReviews and send the filepaths that we just created ("files")
})()

