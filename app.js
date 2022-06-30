const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose")
require('dotenv').config();

const { DB_HOST } = process.env;

mongoose.connect(DB_HOST)
.then(() => { console.log("database connect success") })
  .catch(error => { 
  console.log(error.message);
  process.exit(1);
})

const productsRouter = require("./routes/api/products");
const basketRouter = require("./routes/api/basket/basket");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());


app.use("/api/shoppingcards", productsRouter);
app.use("/api/basket", basketRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;