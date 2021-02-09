const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const queries = require('./postgres/queries.js');
const fs = require('fs');
const csv = require('csv-parser');
const client = require('./postgres/connect.js');

const csvPath = `/home/javan/sdc/dest`;

var cities = [];
let countries = [];
let counter = 1000000;

async function getCities() {
  // var cities = [];
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
      // console.log('got cities...', cities);
      resolve(cities);
    })
  })
  // await fs.createReadStream('./files/worldcities.csv')
  // .pipe(csv())
  // .on('data', row => {
  //   var obj = {}
  //   obj["city"] = row.city;
  //   obj["country"] = row.country;
  //   citiesArr.push(obj);
  // })
  // .on('end', () => {
  //   console.log('got cities...');
  //   // resolve(cities);
  // })
  // return citiesArr
}

async function getCountries() {
  // console.log('getCountries, cities: ...', cities);
  // let countriesArr = [];
  let countryObj = {}
  await cities.forEach((val) => {
    if (!countryObj[val.country]) {
      countryObj[val.country] = val.country;
    }
  })
  for (var country in countryObj) {
    countries.push(country);
  }
  console.log('in getCountries: ...', countries);
  // return countriesArr
  return

}
async function addDestLoop() {
  for(var j = 0; j < 2; j++) {
    // call a function here and pass it i
    await addDests(j);
    console.log(`finished with ${j + 1} addDest`);
  }
}

async function addDests(int) {
  // I moved this into this function should I could make the path dynamic to the argument passed in here
  var file = csvPath + int + '.csv';
  const writeDests = createCsvWriter({
    path: file,
    header: [
      {id: 'destId', title: 'destination_id'},
      {id: 'destName', title: 'destination_name'},
      {id: 'destCountry', title: 'destination_country_name'}
      // {id: 'avgRating', title: 'avg_rating'}    
    ]
  });

  let arr = [];
  let start = int * counter;
  let cityCount = 0;
  let countryCount = 0;
  let cityLen = cities.length - 1;
  let countryLen = countries.length - 1;

  for (let i = 0; i < counter; i++) {
    // console.log(i);
    // console.log(cityCount, countryCount);
    // console.log('cityCount', cities[cityCount]);
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
    // .then(() => {
    //   queries.insertDestsCSV(file)
    //     .catch(err => console.log('getUsers insertUsersCSV error:', err))
    //     .then(() => console.log(`uploading file ${1} to db successful...`))
    // })
  await queries.insertDestsCSV(file)
    .catch(err => console.log('createDestinations insertUsersCSV error:', err))
    .then(() => console.log('createDestinations insertUsersCSV success!'))
  return
}



(async () => {
  await getCities()
    .then(() => console.log('createDestinations.js awaiting getCities finished...'))
    .catch(err => console.log('createDestinations.js err in await for getCities'))
  console.log('cities finished...');
  // console.log(cities);
  await getCountries()
    .then(() => console.log('createDestinations.js awaiting getCountries finished...'))
    .catch(err => console.log('createDestinations.js err in await for getCountries'))
  console.log('countries finished...');
  console.log(countries);
  // so we need to loop through a populate a million destinations at a time
  // do a loop of 10
  // but let's start it at 2
  // await client.connect()
  //   .then(() => console.log('client connected...'))
  //   .catch(err => console.log('client connection error'))
  // (async () => {
  //   for(var j = 0; j < 2; j++) {
  //     // call a function here and pass it i
  //     addDests(j);
  //     console.log(`finished with ${j + 1} addDest`);
  //   }
  // })()
  await addDestLoop()
    .then(() => {
      console.log('addDests loop successful!');
      // client.release()
      //   .then(() => console.log('disconnection successful!'))
      //   .catch(err => console.log('somethingwrong with disconnecting: ', err))
    })
    .catch(err => console.log('addDests loop successful error: ', err))
  // client.end()
  //   .then(() => console.log('disconnection successful!'))
  //   .catch(err => console.log('somethingwrong with disconnecting: ', err))
  // client.end()
})()

