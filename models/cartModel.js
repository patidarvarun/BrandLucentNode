var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cart = new Schema({
    user:{type:Schema.Types.ObjectId ,ref:"user",required: true},
    cart : [{
        product :{type:Schema.Types.ObjectId ,ref:"product", required:true},
        quantity :{type:Number,required:true}
    
    }],
    

})
var Cart = mongoose.model("cart",cart)
module.exports = Cart