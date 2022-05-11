const express = require("express");
const {
  login,
  sendMailToResetPassword,
  restPassword,
} = require("../controllers/loginControllers");
const isverify = require("../middleware/checkAuth");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/").get(userController.working)
router.route("/login").post(login);
router.route("/createUser").post(userController.CreateUser);
router.route("/updateUser").put(isverify, userController.updateUser);
router.route("/getUsers").get(isverify, userController.getAllUser);
router.route("/deleteUser").delete(isverify, userController.deleteUser);
router.route("/sendMailtoRestPw").post(sendMailToResetPassword);
router.route("/getUser").get(isverify, userController.getUserById);
router.route("/resetPassword").post(restPassword);

module.exports = router;
