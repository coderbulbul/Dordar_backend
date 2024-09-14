// Import dependesis
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: String,
    productVariant: String,
    productPrice: Number,
    productStock: Number,
    productDescription: String,
    productImage: String,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
