const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Accounts = mongoose.Schema({
  userid:{type :Schema.Types.ObjectId , required:true},
  fullName: { type: String, required: [true,'full name is required'] },
  email: { type: String ,required:[true , "please Enter Email"]},
  phone: { type: Number, maxLength: 9, required:[true,'phone is required']},
  location: { type: String, required: [true,'location is required'] },
  
});

var account =  mongoose.model("Accounts", Accounts);
module.exports = account;



