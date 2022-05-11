const express = require("express");
const router = express.Router();
const isverify = require("../middleware/checkAuth")
const siteManagementController = require('../controllers/siteManagementController')

router.route('/createHeader').post(isverify,siteManagementController.createHeader);
router.route('/getHeader').get(siteManagementController.getHeaderById);
router.route('/deleteHeader').delete(isverify,siteManagementController.deleteHeaderById);
router.route('/updateHeader').put(isverify,siteManagementController.updateHeader);

module.exports = router;