const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/accountActivation/:token").post(authController.activeAccount);

router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.route("/login").post(authController.login);

router.route("/updateUserPassword/:id");
//   .patch(authController.protect, authController.updateUserPassword);

// router
//   .route("/deleteMe")
//   .delete(authController.protect, userController.deleteMe);

// router
//   .route("/updateMe")
//   .patch(authController.protect, userController.updateMe);

router.route("/getAllusers").get(userController.getAllusers);
router.route("/getUserByNickname").get(userController.getUserByNickname);
router.route("/getUserByRole").get(userController.getUserByRole);
router.route("/disableMyAccount/:id").get(userController.disableMyAccount);

module.exports = router;
