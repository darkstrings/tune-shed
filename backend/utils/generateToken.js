import jwt from "jsonwebtoken";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/** Signs a JWT and stores it in an HTTP-only cookie (not readable by page scripts). */
export default function generateToken(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: THIRTY_DAYS,
  });
}
