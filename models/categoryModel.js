const mongoose = require("mongoose");
const validator = require("validator");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the category name !"],
    unique: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
