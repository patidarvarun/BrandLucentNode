var mongoose = require("mongoose");

const newsLetter = mongoose.Schema({
  title: { type: String, required: [true, "please enter title"] },
  description: { type: String, required: [true, "please enter description"] },
  backgroundImage: { type: String, required: [true, "please enter backgroundImage"] },
});

var NewsLetter = mongoose.model("NewsLatter", newsLetter);
module.exports = NewsLetter;
