const express = require("express");
const cors = require("cors");
const router = require("./Routes/Router");
const mongoose = require("mongoose");
require('dotenv').config();

// Create App
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/auth", router);

// Connect mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Data Base is connected!");
  })
  .catch((err) => {
    console.error(`Data Base Error: ${err}`);
  });

// Export module
module.exports = app;
