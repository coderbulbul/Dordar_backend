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
router.get("/products", productController.fetchProducts);
router.get("/products/:id", productController.fetchProduct);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

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
        message: "Upload done",
        data: result,
      });
    });
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

module.exports = router;
