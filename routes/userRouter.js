const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/accountActivation/:token").patch(authController.activeAccount);

router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.route("/login").post(authController.login);

router
  .route("/updateUserPassword/:id")
  .patch(authController.protect, authController.updateUserPassword);

router
  .route("/disableMyAccount")
  .patch(authController.protect, userController.disableMyAccount);

// router
//   .route("/updateMe")
//   .patch(authController.protect, userController.updateMe);

router
  .route("/getAllusers")
  .get(
    authController.restrictTo("Admin"),
    authController.protect,
    userController.getAllusers
  );
router
  .route("/getUserByNickname")
  .get(
    authController.restrictTo("Admin"),
    authController.protect,
    userController.getUserByNickname
  );
router
  .route("/getAllListener")
  .get(
    authController.restrictTo("Admin"),
    authController.protect,
    userController.getAllListener
  );
router
  .route("/getAllArtists")
  .get(
    authController.restrictTo("Admin"),
    authController.protect,
    userController.getAllArtists
  );
router
  .route("/disableMyAccount")
  .patch(authController.protect, userController.disableMyAccount);
router
  .route("/disableAccountByAdmin/:id")
  .patch(authController.protect, userController.disableAccountByAdmin);

module.exports = router;
