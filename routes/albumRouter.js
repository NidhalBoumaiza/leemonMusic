const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");

router.route("/createAlbum").post(albumController.createAlbum);

router.route("/getAllAlbums").get(albumController.getAllAlbums);

router.route("/getAlbum/:id").get(albumController.getAlbum);

module.exports = router;
