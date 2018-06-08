"use strict";

const config = require("./config");
const express = require("express");
require("./libs/mongoose");
const app = express();


app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: "HR-SYSTEM",
    version: "1.0.0"
  })
});

// run the server
app.listen(config.PORT, () => {
  console.log(`Server runing on port: ${config.PORT}`);
  console.log(`App runing in ENV: ${config.ENV}`);
});