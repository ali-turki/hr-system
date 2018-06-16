'use strict';

const config = require('./config');
const express = require('express');
require('./libs/mongoose');
const app = express();
const apiRouter = require('./routes/api');
const path = require('path');
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'api_doc')));
app.get('/docs', (req, res) => {
  res.sendFile((path.resolve(__dirname, 'api_doc', 'index.html')));
});
app.use('/', apiRouter);

// run the server
app.listen(config.ENV.PORT, () => {
  console.clear();
  console.log(`Server runing on port: ${config.ENV.PORT}`);
  console.log(`App runing in ENV: ${config.ENV.MODE}`);
});