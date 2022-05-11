const express = require("express");
const {
  upload,
  Get_All_Product,
  Delete_product,
  Update_Product,
  Get_product_by_category,
  visitedProductNumberOfTime
} = require("../controllers/productControllers");
const isverify = require("../middleware/checkAuth");

const { product_create } = require("../controllers/productControllers");

const router = express.Router();

router
  .route("/createProduct")
  .post(isverify, upload.single("image"), product_create);
router.route("/getProducts").get(isverify, Get_All_Product);
router.route("/deleteProduct/:id").delete(isverify, Delete_product);
router
  .route("/updateProduct/:id")
  .put(isverify, upload.single("image"), Update_Product);
router
  .route("/getProductBycategory/:id")
  .get(isverify, upload.none(), Get_product_by_category);

router.route("/addvisit").post(visitedProductNumberOfTime);
module.exports = router;

