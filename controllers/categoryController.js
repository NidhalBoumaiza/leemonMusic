const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Category = require("../models/categoryModel");

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "Success",
    categories,
  });
});

exports.addCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create({
    name: req.body.name,
  });
  res.status(200).json({
    status: "success",
    newCategory,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const cat = await Category.findByIdAndDelete({
    _id: req.params.id,
  });
  if (cat) {
    res.status(200).json({
      status: "category deleted :)",
      cat,
    });
  } else {
    return next(new AppError("Cet categorie n'existe pas "));
  }
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    new: true,
    runValidators: true,
  });
  if (cat) {
    return res.status(200).json({
      status: "success",
      cat,
    });
  } else {
    return next(
      new AppError("Un erreur se produis lors de modification de categorie ")
    );
  }
});
