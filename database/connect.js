/** @format */

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://Admin-Karthik:qwerty12@cluster0.semtp.mongodb.net/userJwt",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
