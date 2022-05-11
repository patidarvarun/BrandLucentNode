const express = require("express");
const router = express.Router();
const isverify = require("../middleware/checkAuth")
const { upload} = require("../middleware/uploadFile")
const siteManagementController = require("../controllers/siteManagementController")

router.route("/createBanner").post( isverify,upload.fields([ { name: 'banner', 
maxCount: 1 },{ name: 'logo', maxCount: 1 }]),siteManagementController.createBanner );
router.route("/updateBanner").put( isverify,upload.fields([ { name: 'banner', 
maxCount: 1 },{ name: 'logo', maxCount: 1 }]),siteManagementController.updateBanner );
router.route("/getBanner").get(siteManagementController.getBanner);
router.route("/deleteBanner").delete(isverify,siteManagementController.deleteBanner);

module.exports = router;