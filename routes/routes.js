// Import dependencies
const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const middleware = require("../middleware/middleware");

// Test Router
router.post(
  "/bkash/payment/test",
  middleware.bkash_auth,
  paymentController.test
);

// Route Bkash payment create
router.post(
  "/bkash/payment/create",
  middleware.bkash_auth,
  paymentController.payment_create
);

// Route Bkash payment callback
router.get(
  "/bkash/payment/callback",
  middleware.bkash_auth,
  paymentController.call_back
);

// Route Bkash payment refund
router.get(
  "/bkash/payment/refund/:trxID",
  middleware.bkash_auth,
  paymentController.refund
);

module.exports = router;
