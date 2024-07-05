// Load env variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import dependencies
const express = require("express");
const cors = require("cors");
const body_parser = require("body-parser");
const connectToDb = require("./config/connectToDb");
const Product = require("./models/product");
const productController = require("./controllers/productsController");

// Create an express app
const app = express();

// Configure express app
app.use(express.json());
app.use(body_parser.json());
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);

// Connect to database
connectToDb();

// Routing
app.get("/products", productController.fetchProducts);
app.get("/products/:id", productController.fetchProduct);
app.post("/products", productController.createProduct);
app.put("/products/:id", productController.updateProduct);
app.delete("/products/:id", productController.deleteProduct);

// Bkash Routes
app.use("/", require("./routes/routes"));

// Start our server
app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT} `)
);
