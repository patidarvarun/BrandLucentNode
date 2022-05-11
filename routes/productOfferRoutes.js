const express = require("express");
const { upload } = require("../controllers/categoryController");
const {
  product_offer_create,
  Get_offers_Product,
  Update_Product_offer,
  Delete_product_offer,
} = require("../controllers/offersController");

const router = express.Router();
router
  .route("/createProductOffer")
  .post(upload.single("image"), product_offer_create);

router.route("/GetProductOffer").get(Get_offers_Product);
router
  .route("/updateProductOffer/:id")
  .put(upload.none(), Update_Product_offer);
router.route("/deleteProductOffer/:id").delete(Delete_product_offer);

module.exports = router;
