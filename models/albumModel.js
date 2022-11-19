/*const mongoose = require("mongoose");
const validator = require("validator");

const albumSchema = mongoose.Schema({
  owner: {
    type: String,
  },
  albumName: {
    type: String,
    required: [true, "Please provide the album name !"],
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  type: {
    type: String,
    enum: ["Single", "Album"],
  },
  songs: [{ song: String, songName: String }],
});

const Album = mongoose.model("Album", albumSchema);
module.exports = Album;*/
