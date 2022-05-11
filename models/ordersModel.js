var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = mongoose.Schema({
  productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "pending" },
  quantity: { type: Number, required: true },
});

var Cat = mongoose.models.Order || mongoose.model("Orders", Order);
module.exports = Cat;
