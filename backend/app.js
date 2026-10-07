import path from "node:path";
import fs from "node:fs";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { UPLOAD_DIR } from "./config/uploads.js";

const app = express();
const root = path.resolve();
const isProd = process.env.NODE_ENV === "production";

// Render (and most hosts) sit behind a proxy; needed for secure cookies + rate limiting by IP.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // PayPal's checkout SDK loads scripts, frames and images from its own domains.
        "script-src": ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com"],
        "frame-src": ["'self'", "https://*.paypal.com"],
        "connect-src": ["'self'", "https://*.paypal.com"],
        "img-src": ["'self'", "data:", "blob:", "https://*.paypal.com", "https://*.paypalobjects.com"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
    // PayPal checkout opens a popup that needs to talk back to this window.
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => res.json({ clientId: process.env.PAYPAL_CLIENT_ID ?? "" }));
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

const clientDist = path.join(root, "frontend", "dist");
if (isProd && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: "1y", index: false }));
  // Anything that isn't an API route gets the single-page app.
  app.get(/^(?!\/api\/|\/uploads\/).*/, (req, res) => res.sendFile(path.join(clientDist, "index.html")));
} else {
  app.get("/", (req, res) => res.send("Tune Shed API is running…"));
}

app.use(notFound);
app.use(errorHandler);

export default app;
