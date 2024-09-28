// Import dependencies
const router = require("express").Router();
const middleware = require("../middleware/middleware");
const paymentController = require("../controllers/paymentController");
const productController = require("../controllers/productsController");
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { uploadStorage } = require("../middleware/multerMiddleware");
const cloudinary = require("../utilites/cloudinaryConfig");

// Products Routing
router.get("/api/products", productController.fetchProducts);
router.get("/api/products/:id", productController.fetchProduct);
router.post("/api/products", productController.createProduct);
router.put("/api/products/:id", productController.updateProduct);
router.delete("/api/products/:id", productController.deleteProduct);

// User Routing start
router.post("/api/users", registerUser);
router.post("/api/users/auth", authUser);
router.post("/api/users/logout", logoutUser);
router
  .route("/api/users/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Routes for product Image upload
router.post(
  "/upload-image",
  uploadStorage.single("image"),
  function (req, res) {
    try {
      cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error",
          });
        }
        res.status(200).json({
          success: true,
          message: "Upload done successfully",
          data: result,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
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

// Route for fetch orders data
router.get("/api/payment/orders", paymentController.fetchOrders);
router.delete("/api/payment/orders/:id", paymentController.deleteOrder);

module.exports = router;
