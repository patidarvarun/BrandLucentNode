var mongoose = require("mongoose");

const Category = mongoose.Schema({
  name: { type: String, required: [true, "please enter name"] },
  image: { type: String, required: [true, "please enter image"] },
});

var Cat = mongoose.models.Category || mongoose.model("Categorys", Category);
module.exports = Cat;
