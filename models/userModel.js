const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Users = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, maxLength: 9, required: true },
  password: { type: String, required: true },
  role: { type: Boolean, default: 0 },
  status: { type: String, default: "pending" },
  resetToken: String,
  expireToken: Date,
});

var user = mongoose.models.Users || mongoose.model("User", Users);
module.exports = user;
