import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/** Requires a valid JWT cookie; attaches the user (without password) to req.user. */
export async function protect(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please sign in");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error("Not authorized, session expired");
  }

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("Not authorized, account no longer exists");
  }
  req.user = user;
  next();
}

export function admin(req, res, next) {
  if (req.user?.isAdmin) return next();
  res.status(403);
  throw new Error("Not authorized as an admin");
}

/**
 * Demo accounts can browse everything (including the admin area) but can't change
 * shared data, so the public demo stays intact for the next visitor.
 */
export function blockDemo(req, res, next) {
  if (req.user?.isDemo) {
    res.status(403);
    throw new Error("Demo accounts are read-only. Create your own account to try this.");
  }
  next();
}
