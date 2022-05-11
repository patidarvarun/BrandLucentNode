const express = require("express");
const router = express.Router();
const isverify = require("../middleware/checkAuth")
const {addToCart,getProductFromCart,removeProductFromCart, youMayLike, getDetailsOfProduct} = require("../controllers/cartController")
router.route("/addToCart").post(isverify,addToCart)
router.route("/viewCart").get(isverify,getProductFromCart)
router.route("/removeProductOfCart").delete(isverify,removeProductFromCart)
router.route("/youMayLike").get(isverify,youMayLike)
router.route("/productDeatils").get(isverify,getDetailsOfProduct)
module.exports = router