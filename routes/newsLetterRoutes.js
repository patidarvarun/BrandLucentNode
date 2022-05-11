const express = require("express");
const router = express.Router();
const isverify = require("../middleware/checkAuth")
const { upload} = require("../middleware/uploadFile")
const siteManagementController = require("../controllers/siteManagementController")

router.route("/createNewsLetter").post(isverify,upload.single('backgroundImage'),siteManagementController.createNewsLetter);
router.route("/updateNewsLetter").put(isverify,upload.single("backgroundImage"),siteManagementController.updateNewsLetter);
router.route("/getNewsLetter").get(siteManagementController.getNewsLetter);
router.route("/deleteNewsLetter").delete(isverify ,siteManagementController.deleteNewsLetter);


module.exports = router;