const mongoose = require('mongoose');
const config = require('../config');

let mongodbConnection = `${config.DB.HOST}/${config.DB.NAME}`;
if (config.ENV.MODE === 'production') {
  mongodbConnection = 'mongodb://aliturki:asdqwe123@ds259820.mlab.com:59820/hr-system';
}

mongoose.connect(mongodbConnection)
  .then(result => {
    console.log(`mongodb runing on the ${config.ENV.MODE} env...`);
  })
  .catch(err => {
    console.log(err.message);
  });