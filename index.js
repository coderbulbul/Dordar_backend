// Load env variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import dependencies
const express = require("express");
const cors = require("cors");
const body_parser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectToDb = require("./config/connectToDb");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT || 5000;

// Create an express app
const app = express();

// Configure express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Connect to DB
connectToDb();

// Routes import from routes
app.use("/", require("./routes/routes"));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Listen to our server
app.listen(port, () => console.log(`App listening on port ${port} `));
