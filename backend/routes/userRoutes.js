import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { protect, admin, blockDemo } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.route("/").post(authLimiter, registerUser).get(protect, admin, getUsers);
router.post("/auth", authLimiter, authUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect, getUserProfile).put(protect, blockDemo, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, blockDemo, checkObjectId, deleteUser)
  .get(protect, admin, checkObjectId, getUserById)
  .put(protect, admin, blockDemo, checkObjectId, updateUser);

export default router;
