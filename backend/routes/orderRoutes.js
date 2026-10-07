import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getSummary,
} from "../controllers/orderController.js";
import { protect, admin, blockDemo } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.get("/mine", protect, getMyOrders);
router.get("/summary", protect, admin, getSummary);
router.get("/:id", protect, checkObjectId, getOrderById);
router.put("/:id/pay", protect, checkObjectId, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, blockDemo, checkObjectId, updateOrderToDelivered);

export default router;
