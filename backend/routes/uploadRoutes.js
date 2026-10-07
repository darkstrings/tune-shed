import path from "node:path";
import crypto from "node:crypto";
import express from "express";
import multer from "multer";
import { protect, admin, blockDemo } from "../middleware/authMiddleware.js";
import { UPLOAD_DIR } from "../config/uploads.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  // Random names: never trust the uploaded filename.
  filename: (req, file, cb) =>
    cb(null, `image-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${path.extname(file.originalname).toLowerCase()}`),
});

function fileFilter(req, file, cb) {
  const okExt = /\.(jpe?g|png|webp)$/i.test(file.originalname);
  const okMime = /^image\/(jpeg|png|webp)$/.test(file.mimetype);
  if (okExt && okMime) cb(null, true);
  else cb(new Error("Images only (JPG, PNG or WebP)"), false);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single("image");

// Previously this route had no auth at all; now only (non-demo) admins can upload.
router.post("/", protect, admin, blockDemo, (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No image received" });
    res.json({ message: "Image uploaded", image: `/uploads/${req.file.filename}` });
  });
});

export default router;
