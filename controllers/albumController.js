const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Album = require("../models/albumModel");
const { userInfo } = require("os");
const { findOne, findOneAndDelete } = require("../models/albumModel");

exports.getAllAlbums = catchAsync(async (req, res, next) => {
  const albums = await Album.find().populate({
    path: "songs",
    select: "-__v -_id",
  });
  res.status(201).json({
    status: "success",
    accountNumber: albums.length,
    albums,
  });
});

exports.createAlbum = catchAsync(async (req, res, next) => {
  const newAlbum = await Album.create({
    owner: req.body.owner, //req.user.firstName + " " + req.user.lastName,
    albumName: req.body.albumName,
    type: req.body.type,
    songs: req.body.songs,
    cover: req.body.cover,
  });
  res.status(201).json({
    status: "Success",
    message: "your album is succefilly added",
    newAlbum,
  });
});

/*exports.searchAlbumByName = catchAsync(async (req, res, next) => {
  const album = await findOne({ albumName: req.body.albumName });
  if (!album) {
    return next(new AppError("There is no album with this name .", 500));
  }
  res.status(201).json({
    status: "Success",
    album,
  });
});

exports.searchAlbumByArtist = catchAsync(async (req, res, next) => {
  const albums = await findOne({ owner: req.body.owner });
  if (!albums) {
    return next(new AppError("There is no album with this name .", 500));
  }
  res.status(201).json({
    status: "Success",
    albums,
  });
});

exports.modifyAlbum = catchAsync(async (req, res, next) => {
  const album = await findOne({ albumName: req.body.albumName });
  album.owner = req.body.owner;
  album.albumName = req.body.albumName;
  album.type = req.body.type;
  album.songs = req.body.songs;
  await album.save();
  res.status(201).json({
    status: "success",
    messgae: "successfully modified ",
  });
});

exports.deleteAlbum = catchAsync(async (req, res, next) => {
  const album = await findOneAndDelete({ albumName: req.body.albumName });
  res.status(201).json({
    status: "success",
    message: "the album is succceffully deleted",
  });
});*/
