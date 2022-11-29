const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");

router.route("/createAlbum").post(albumController.createAlbum);

router.route("/getAllAlbums").get(albumController.getAllAlbums);

module.exports = router;
