const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//Routes middleware
const product = require("./routes/product");
const category = require("./routes/category");

const api = process.env.API_URL;

app.use(`${api}/product`, product);

app.use(`${api}/category`, category);

//database
mongoose
  .connect(process.env.CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

//server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}`);
});
