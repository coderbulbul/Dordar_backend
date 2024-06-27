// Import dependencies
const axios = require("axios");
const globals = require("node-global-storage");

class middleware {
  // Bkash grant token generate
  bkash_auth = async (req, res, next) => {
    // Unset previous token
    globals.unsetValue("id_token");
    // Generate new token
    try {
      const { data } = await axios.post(
        process.env.bkash_grant_token_url,
        {
          // Request parameters
          app_key: process.env.bkash_api_key,
          app_secret: process.env.bkash_secret_key,
        },
        {
          // Request Headers
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: process.env.bkash_username,
            password: process.env.bkash_password,
          },
        }
      );
      // Store "id_token" value global storage
      globals.setValue("id_token", data.id_token, { protected: true });
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };
}

module.exports = new middleware();
