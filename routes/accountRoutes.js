const express = require("express");
const { addAccount, getAccountInfo, changeLocation } = require("../controllers/accountController");
const router = express.Router();
const isverify = require("../middleware/checkAuth");
router.route("/addAccountInfo").post(isverify,addAccount)
router.route("/getAccountInfo").get(isverify,getAccountInfo)
router.route("/changeLocation").put(isverify,changeLocation)
module.exports = router