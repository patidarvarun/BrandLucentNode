const express = require("express");
const {
  create_Category,
  upload,
  DeleteCategory,
  Get_Category,
  updateCategory,
} = require("../controllers/categoryController");
const isverify = require("../middleware/checkAuth");

const router = express.Router();

router
  .route("/createCategory")
  .post(isverify, upload.single("image"), create_Category);
router.route("/deleteCategory/:id").delete(isverify, DeleteCategory);
router.route("/getCategory").get(Get_Category);
router
  .route("/updateCategory/:id")
  .put(isverify, upload.single("image"), updateCategory);

module.exports = router;
