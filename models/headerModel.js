const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Header = mongoose.Schema({
  labelofheader: { type: String, required:  [true, "please enter labelofheader"] },
  titleofcontent: { type: String, required: [true, "please enter titleofcontent"]},
  contentofpage :{type:String , require: [true, "please enter contentofpage"]}

});

var header = mongoose.model("Header", Header);
module.exports = header;
