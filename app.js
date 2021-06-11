const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

require("dotenv/config");

const api = process.env.API_URL;
app.get(api, (req, res) => {
  const product = {
    id: 1,
    name: "MOMO",
    some: "some",
  };
  res.send(product);
});

app.post(api, (req, res) => {
  const newData = req.body;
  res.send(newData);
  console.log(newData);
});

mongoose
  .connect(process.env.CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("err");
  });

app.listen(3000, () => {
  console.log(api);
  console.log("app runnig in post 3000");
});
