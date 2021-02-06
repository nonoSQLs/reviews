const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fetch = require('node-fetch');

function fetchUsers() {
  return new Promise(resolve => {
    // currently this is 5 but we want it to be 5000
    fetch('https://randomuser.me/api/?results=5')
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
  path: './files/users.csv',
  header: [
    {id: 'userId', title: 'user_id'},
    {id: 'country', title: 'user_home_location'},
    {id: 'profilePic', title: 'user_profile_pic'}    
  ]
})

async function getUsers() {
  const users = await fetchUsers();
  return users
} 

getUsers()
  .then(data => {
    // console.log(data.results[0].location)
    const users = data.results.map((val, i) => {
      let obj = {}
      obj["userId"] = i;
      obj["country"] = val.location.country;
      obj["profilePic"] = val.picture.thumbnail;
      return obj
    })
    return users
  })
  .then(data => console.log(data))
  .catch(err => console.log(err))
