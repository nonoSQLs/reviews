const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const queries = require('./postgres/queries.js');
const fs = require('fs');
const csv = require('csv-parser');
const client = require('./postgres/connect.js');

const csvPics = `/home/javan/sdc/pictures`;
const csvReviews = `/home/javan/sdc/reviews`;

async function getPicFiles() {
  let picFiles = [];
  for(var i = 0; i < 100; i++) {
    picFiles.push(`http://d20lp9tw1uk7y6.cloudfront.net/images/tripadvisor_thailand_${i}.jpg`)
  }
  return picFiles;
}

async function getInfo(path) {
  let reviews = [];
  let files = await getPicFiles();
  console.log('file: ', path);
  return new Promise(resolve => {
    fs.createReadStream(path)
    .pipe(csv())
    .on('data', row => {
      var obj = {}
      obj["review_id"] = row.review_id;
      obj["destination_id"] = row.destination_id;
      obj["picture_id"] = row.review_id;
      obj["picture_url"] = files[Math.floor(Math.random() * 100)];
      obj["picture_alt_tag"] = 'travel photo';
      reviews.push(obj);
    })
    .on('end', () => {
      console.log('got reviews...');
      resolve(reviews);
    })
  })
}

async function addDestLoop() {
  
  for(var j = 0; j < 100; j++) {
    
    let reviewFile = csvReviews + j + '.csv';
    let picFile = csvPics + j + '.csv';
    let reviews = await getInfo(reviewFile);

    const writePics = createCsvWriter({
      path: picFile,
      header: [
        {id: 'picture_id', title: 'picture_id'},
        {id: 'review_id', title: 'review_id'},
        {id: 'destination_id', title: 'destination_id'},
        {id: 'picture_url', title: 'picture_url'},
        {id: 'picture_alt_tag', title: 'picture_alt_tag'}

        // {id: 'avgRating', title: 'avg_rating'}    
      ]
    });

    console.log(`finished with ${j + 1} addDest`);

    await fs.unlink(reviewFile, err => {
      if (err) {
        console.log('fs.unlink error for file' + path, err) 
      } else {
        console.log(reviewFile + ' deleted.')
      }
    })

    await writePics.writeRecords(reviews)
      .catch(err => console.log('createPictures writeRecords error: ', err))
      .then(() => console.log('createPictures writeRecords success!'))
    await queries.insertPicturesCSV(picFile)
      .catch(err => console.log('createPictures insertPicsCSV error:', err))
      .then(() => {
        console.log('createPictures insertPicsCSV success!')
      })
  }
}

addDestLoop();