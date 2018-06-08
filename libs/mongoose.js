const mongoose = require("mongoose");
const config = require("../config");
mongoose.connect(`${config.DB_HOST}/${config.DB_NAME}`)
  .then(result => {
    console.log(`mongodb runing on ${config.DB_HOST}/${config.DB_NAME}`)
  })
  .catch(err => {
    console.log(err.message)
  });