const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fetch = require('node-fetch');
const makeDir = require('make-dir');
const queries = require('./postgres/queries.js');

const path = `/home/javan/sdc/`;
const csvPath = `/home/javan/sdc/users.csv`

function fetchUsers() {
  return new Promise(resolve => {
    // currently this is 5 but we want it to be 5000
    fetch('https://randomuser.me/api/?results=5000')
    .then((response) => {
      console.log('received data from randomuser');
      return response.json()
    })
    .then((fakeUsers) => {
      resolve(fakeUsers);
    })
    .catch(err => resolve(err));
  })
}

const writeUsers = createCsvWriter({
  path: csvPath,
  header: [
    {id: 'userId', title: 'user_id'},
    {id: 'userName', title: 'user_name'},
    {id: 'country', title: 'user_home_location'},
    {id: 'profilePic', title: 'user_profile_pic'}    
  ]
});

async function getUsers() {
  makeDir(path)
    .catch(err => console.log('makeDir error: ', err));
  const users = await fetchUsers();
  return users
} 

getUsers()
  .then(data => {
    const users = data.results.map((val, i) => {
      // console.log(val);
      let obj = {}
      obj["userId"] = i;
      obj["userName"] = val.login.username;
      obj["country"] = val.location.country;
      obj["profilePic"] = val.picture.thumbnail;
      console.log(obj);
      return obj
    })
    return users
  })
  .then(data => {
    writeUsers.writeRecords(data);
  })
  .then(() => {
    queries.insertUsersCSV(csvPath)
      .catch(err => console.log('getUsers insertUsersCSV error:', err))
  })
  .then(() => console.log('csv write success!'))
  .catch(err => console.log(err))
