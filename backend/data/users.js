import crypto from "node:crypto";

// Passwords are hashed by the User model when these are created.
// The real admin password comes from SEED_ADMIN_PASSWORD (or is generated and printed once).
export const adminUser = {
  name: "Admin User",
  email: process.env.SEED_ADMIN_EMAIL || "admin@email.com",
  password: process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString("base64url"),
  isAdmin: true,
};

// Shared, read-only accounts for portfolio visitors (shown on the sign-in page).
export const demoUsers = [
  { name: "Demo Shopper", email: "demo@tuneshed.com", password: "tuneshed-demo", isDemo: true },
  { name: "Demo Admin", email: "demo-admin@tuneshed.com", password: "tuneshed-demo", isAdmin: true, isDemo: true },
];

export const sampleCustomers = [
  { name: "John Doe", email: "john@email.com", password: "rock-n-roll-1" },
  { name: "Jane Doe", email: "jane@email.com", password: "rock-n-roll-2" },
];
