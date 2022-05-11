const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Footer = mongoose.Schema({
  title: { type: String, required:  [true, "please enter title"] },
  labeloffooter: { type: String, required:  [true, "please enter labeloffooter"] },
  titleoffooter: { type: String, required:  [true, "please enter titleoffooter"]},
  contentofpage :{type:String , require:  [true, "please enter contentofpage"]}

});

var footer = mongoose.model("Footer", Footer);
module.exports = footer;    