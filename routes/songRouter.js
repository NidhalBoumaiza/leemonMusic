const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");

router.route("/addSong").post(songController.addSong);

module.exports = router;
