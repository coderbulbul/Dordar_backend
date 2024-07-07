const Product = require("../models/product");

const mainRoute = async (req, res) => {
  // Just print hello
  console.log(process.env.bkash_username);
  res.json({ greetings: process.env.bkash.bkash_username });
};

const fetchProducts = async (req, res) => {
  // Find the notes
  const product = await Product.find();
  // Respond with them
  res.json({ product });
};

const fetchProduct = async (req, res) => {
  // Get id off the url
  const productId = req.params.id;
  //Find the note using that id
  const product = await Product.findById(productId);
  // Respond with the note
  res.json({ product });
};

const createProduct = async (req, res) => {
  // Get the sent data off request body
  const {
    productName,
    productVariant,
    productPrice,
    productStock,
    productDescription,
    productImage,
  } = req.body;

  // Create a product with it
  const product = await Product.create({
    productName,
    productVariant,
    productPrice,
    productStock,
    productDescription,
    productImage,
  });

  // Respond with the new note
  res.json({ product });
};

const updateProduct = async (req, res) => {
  // Find the id
  const productId = req.params.id;

  // Get the data of the req body
  const {
    productName,
    productVariant,
    productPrice,
    productStock,
    productDescription,
    productImage,
  } = req.body;

  // Get the note by id &
  await Product.findByIdAndUpdate(productId, {
    productName,
    productVariant,
    productPrice,
    productStock,
    productDescription,
    productImage,
  });

  // Find updated note
  const product = await Product.findById(productId);

  // Respond with it
  res.json({ product });
};

const deleteProduct = async (req, res) => {
  // Get id off url
  const productId = req.params.id;

  // Delete the record
  await Note.deleteOne({ _id: productId });

  // Respond
  res.json({ success: "Record Deleted" });
};

module.exports = {
  mainRoute,
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
