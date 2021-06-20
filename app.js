const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helper/jwt");
const errorHandler = require("./helper/error-handler");

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//Routes middleware
const product = require("./routes/product");
const category = require("./routes/category");
const user = require("./routes/user");

const api = process.env.API_URL;

app.use(`${api}/product`, product);

app.use(`${api}/category`, category);

app.use(`${api}/user`, user);

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
