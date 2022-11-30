const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");

router.route("/addSong").post(songController.addSong);

router.route("/deleteSong/:id").delete(songController.deleteSong);

router.route("/updateSong/:id").patch(songController.updateSong);

router.route("/findSongByName").get(songController.findSongByName);

router.route("/findSongByCategory").get(songController.findSongByCategory);

router.route("/findSongByArtist").get(songController.findSongByArtist);

router.route("/searchBar").get(songController.searchBar);

router.route("/todayHits").get(songController.todayHits);

module.exports = router;
