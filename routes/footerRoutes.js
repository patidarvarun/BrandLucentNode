const express = require("express");
const router = express.Router();
const isverify = require("../middleware/checkAuth")
const siteManagementController = require('../controllers/siteManagementController')

router.route('/createFooter').post(isverify,siteManagementController.createFooter);
router.route('/getFooter').get(siteManagementController.getFooter);
router.route('/deleteFooter').delete(isverify,siteManagementController.deleteFooterById);
router.route('/updateFooter').put(isverify,siteManagementController.updateFooter);

module.exports = router;