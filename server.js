'use strict';

const config = require('./config');
const express = require('express');
require('./libs/mongoose');
const app = express();
const apiRouter = require('./routes/api');
const path = require('path');
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With, token'
  );

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.send(200);
  } else {
    //move on
    next();
  }
});

app.use('/', apiRouter);


// run the server
app.listen(config.ENV.PORT, () => {
  console.clear();
  console.log(`Server runing on port: ${config.ENV.PORT}`);
  console.log(`App runing in ENV: ${config.ENV.MODE}`);
});