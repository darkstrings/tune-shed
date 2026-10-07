import fs from "node:fs";
import path from "node:path";

// On Render, product images live on a persistent disk mounted at /var/data/uploads.
// Set UPLOAD_DIR to override; locally it defaults to ./uploads.
export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : process.env.NODE_ENV === "production" && fs.existsSync("/var/data")
    ? "/var/data/uploads"
    : path.resolve("uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
