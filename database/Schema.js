/** @format */

const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: String,
    required: true,
  },
});

const User = new mongoose.model("User", usersSchema);

module.exports = User;
