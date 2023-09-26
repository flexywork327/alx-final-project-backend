const mongoose = require("mongoose");

const categoriesSchema = mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Categories", categoriesSchema);
