const mongoose = require('mongoose');
const config = require('../config');
mongoose.connect(`${config.DB.HOST}/${config.DB.NAME}`)
  .then(result => {
    console.log(`mongodb runing on ${config.DB.HOST}/${config.DB.NAME}`);
  })
  .catch(err => {
    console.log(err.message);
  });