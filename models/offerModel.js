var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOffers = mongoose.Schema({
  discountPrice: {
    type: Number,
    required: [true, "please enter discount price"],
  },
  cat_id: {
    type: Schema.Types.ObjectId,
    ref: "Categorys",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
});

var product = mongoose.model("productOffer", productOffers);
module.exports = product;
