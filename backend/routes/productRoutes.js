import express from "express";
import {
  getProducts,
  getFilters,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin, blockDemo } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, blockDemo, createProduct);
router.get("/top", getTopProducts);
router.get("/filters", getFilters);
router.post("/:id/reviews", protect, blockDemo, checkObjectId, createProductReview);
router
  .route("/:id")
  .get(checkObjectId, getProductById)
  .put(protect, admin, blockDemo, checkObjectId, updateProduct)
  .delete(protect, admin, blockDemo, checkObjectId, deleteProduct);

export default router;
