import { rateLimit } from "express-rate-limit";

// Slows down password guessing and sign-up spam.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
  skip: () => process.env.NODE_ENV === "test",
});
