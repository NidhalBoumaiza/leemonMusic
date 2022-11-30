const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Album = require("../models/albumModel");
const Account = require("../models/accountModel");
const Song = require("../models/songModel");
const {
  findByIdAndDelete,
  findByIdAndUpdate,
} = require("../models/albumModel");

const formattedDate = function (date) {
  let str = new Date(Date.now()).toLocaleString().split(",")[0];
  str = str.split("/").join("-");
  str = dd + "-" + 12 + "-" + yyyy;
  console.log("apres : " + str);
  return str;
};

const { json } = require("express");
exports.addSong = catchAsync(async (req, res, next) => {
  let album = await Album.findOne({ albumName: req.body.albumName });
  const newSong = await Song.create({
    name: req.body.name,
    musicSrc: req.body.musicSrc,
    category: req.body.category,
    //singer: req.user.nickName,
    cover: req.body.cover,
  });
  if (album) {
    let songs = album.songs;
    songs = songs.push(newSong._id);
    album.songs = songs;
    album.save({ validateBeforeSave: false });
  }
  res.status(201).json({
    status: "success",
    newSong,
    album,
  });
});
//--------------------- delete song  -----------------------
exports.deleteSong = catchAsync(async (req, res, next) => {
  const song = await Song.findByIdAndDelete(req.params.id, {});
  res.status(200).json({
    status: "deleted succeffuly",
    song,
  });
});
//------------------- Modify song -----------------------
exports.updateSong = catchAsync(async (req, res, next) => {
  const song = await Song.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    musicSrc: req.body.musicSrc,
    category: req.body.category,
    cover: req.body.cover,
    validateBeforeSave: false,
  });
  res.status(200).json({
    status: "updated succeffuly",
    song,
  });
});
// ------------------------ like song ------------------------
exports.likeSong = catchAsync(async (req, res, next) => {
  await findByIdAndUpdate(req.params.id, { likes: likes + 1 });
  res.status(200).json({
    status: "liek added succefully",
  });
});
//---------------find song by name ------------------------------
exports.findSongByName = catchAsync(async (req, res, next) => {
  const songs = await Song.find({ songName: req.body.search });
  if (songs) {
    return res.status(200).json({
      status: "success",
      songsNumber: songs.length,
      songs,
    });
  } else {
    return res.status(200).json({
      status: "failed",
      message: "Il n'y a pas de chansons de ce nom",
    });
  }
});
//---------------- find song by category --------------------
exports.findSongByCategory = catchAsync(async (req, res, next) => {
  const songs = await Song.find({ category: req.body.search });
  if (songs) {
    return res.status(200).json({
      status: "success",
      songsNumber: songs.length,
      songs,
    });
  } else {
    return res.status(200).json({
      status: "failed",
      message: "Il n'y a pas de chansons de ce categorie",
    });
  }
});
//----------------- find song by artist ------------------------
exports.findSongByArtist = catchAsync(async (req, res, next) => {
  const songs = await Song.find({ category: req.body.search });
  if (songs) {
    return res.status(200).json({
      status: "success",
      songsNumber: songs.length,
      songs,
    });
  } else {
    return res.status(200).json({
      status: "failed",
      message: "Il n'y a pas de chansons de ce categorie",
    });
  }
});

//---------------- Contains --------------------------
exports.searchBar = catchAsync(async (req, res, next) => {
  const songs = await Song.find({
    songName: { $regex: req.body.searchBar, $optins: "i" },
  }).select(songName);
  const albums = await Album.find({
    albumName: { $regex: req.body.searchBar, $optins: "i" },
  }).select(albumName);
  const singers = await Account.find(
    {
      nickName: { $regex: req.body.searchBar, $optins: "i" },
    },
    { role: "ARTIST" }
  );
  res.status(200).json({
    status: "this what we found",
    songNumber: songs.length,
    albumNumber: albums.length,
    singerNumber: singers.length,
    songs,
    albums,
    singers,
  });
});
//--------------------- today hits -----------------------
exports.todayHits = catchAsync(async (req, res, next) => {
  let today = formattedDate(Date.now());
  console.log(today);
  today = new Date(today);
  console.log(today);
  const todaythits = await Song.aggregate([
    {
      $match: {
        creationDate: { $lt: today },
      },
    },
    //{ $sort: 1 },
    { $limit: 10 },
  ]);
  res.status(200).json({
    status: "Todays hits",
    todaythitsNumber: todaythits.length,
    todaythits,
  });
});
//--------------------- today album -----------------------
