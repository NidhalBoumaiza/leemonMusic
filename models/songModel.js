const mongoose = require("mongoose");
const validator = require("validator");

const songSchema = mongoose.Schema({
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
    required: [true, "Please provide the song name !"],
  },
  singer: String,
  cover: String,
  musicSrc: {
    type: String,
    // required: [true, "Please Enter song src !"],
  },
  category: [],
  likes: {
    type: Number,
    default: 0,
  },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
