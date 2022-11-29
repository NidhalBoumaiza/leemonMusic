const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.route("/getAllCategories").get(categoryController.getAllCategories);
router.route("/addCategory").post(categoryController.addCategory);
router.route("/deleteCategory/:id").delete(categoryController.deleteCategory);
router.route("/updateCategory/:id").patch(categoryController.updateCategory);

module.exports = router;
