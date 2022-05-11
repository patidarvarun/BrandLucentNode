const express = require("express");
const {
  saveOrder,
  getUserOrder,
  Update_Order_Status,
  getBestSelling,
  getpopularProduct,
} = require("../controllers/orderControllers");
const router = express.Router();

const isverify = require("../middleware/checkAuth");

router.route("/saveOrder").post(saveOrder);
router.route("/getUserOrders/:id").get(getUserOrder);
router.route("/getBestselling").get(isverify, getBestSelling),
  router.route("/getPopular").get(isverify, getpopularProduct),
  router.route("/getOrders/:id?").get(getUserOrder);
router.route("/updateStatus/:id").put(Update_Order_Status);

module.exports = router;
