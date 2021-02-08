const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fetch = require('node-fetch');
const queries = require('./postgres/queries.js');
const fs = require('fs');
const csv = require('csv-parser');
// const data = require('./seed2.js');
const csvPath = `/home/javan/sdc/dest`;
const csvFile = `/home/javan/sdc/dest.csv`;

let cities, dest;
let countries = [];
let counter = 1000000;

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

async function addDests(int) {
  // I moved this into this function should I could make the path dynamic to the argument passed in here
  const writeDests = createCsvWriter({
    path: csvPath + int + '.csv',
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
  writeDests.writeRecords(arr)
    .catch(err => console.log('createDestinations writeDests error: ', err))
  
  return
}

function getCountries() {
  let countryObj = {}
  cities.forEach((val) => {
    if (!countryObj[val.country]) {
      countryObj[val.country] = val.country;
    }
  })
  for (var country in countryObj) {
    countries.push(country);
  }
  return
}


(async () => {
  cities = await getCities();
  console.log('cities finished...');
  // console.log(cities);
  await getCountries();
  console.log('countries finished...');
  // console.log(countries);
  // so we need to loop through a populate a million destinations at a time
  // do a loop of 10
  // but let's start it at 2
  for(var j = 0; j < 2; j++) {
    // call a function here and pass it i
    await addDests(j);
    console.log(`finished with ${j + 1} addDest`);
  }
  // dest = await data.getDestinations();
  // console.log(dest);
})()