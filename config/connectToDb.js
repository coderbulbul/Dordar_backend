// Load env variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import dependencies
const mongoose = require("mongoose");

// Connection to database
async function connectToDb() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(`Great!!! DB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectToDb;
