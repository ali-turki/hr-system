'use strict';

const config = require('./config');
const express = require('express');
require('./libs/mongoose');
const app = express();
const apiRouter = require('./routes/api');

app.use(express.json());

app.use('/', apiRouter);

// run the server
app.listen(config.PORT, () => {
  console.clear();
  console.log(`Server runing on port: ${config.PORT}`);
  console.log(`App runing in ENV: ${config.ENV}`);
});