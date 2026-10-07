// End-to-end API tests. Needs a MongoDB to talk to:
//   MONGO_URI=mongodb://127.0.0.1:27017/tuneshed-test npm test
// PayPal is replaced by a tiny local mock server.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET ||= "test-secret";
process.env.MONGO_URI ||= "mongodb://127.0.0.1:27017/tuneshed-test";

// --- PayPal mock -----------------------------------------------------------
const paypalOrders = {}; // id -> { status, value }
const paypal = http.createServer((req, res) => {
  res.setHeader("content-type", "application/json");
  if (req.url === "/v1/oauth2/token") return res.end(JSON.stringify({ access_token: "tok" }));
  const id = req.url.split("/").pop();
  const o = paypalOrders[id];
  if (!o) return res.writeHead(404).end("{}");
  res.end(JSON.stringify({ status: o.status, purchase_units: [{ amount: { value: o.value } }] }));
});

const { default: mongoose } = await import("mongoose");
const { default: app } = await import("../app.js");
const { default: User } = await import("../models/userModel.js");
const { default: Product } = await import("../models/productModel.js");
const { default: Order } = await import("../models/orderModel.js");

let server;
let base;

// Minimal cookie-aware client.
function client() {
  let cookie = "";
  return async (method, path, body) => {
    const res = await fetch(base + path, {
      method,
      headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const set = res.headers.get("set-cookie");
    if (set) cookie = set.split(";")[0];
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, data };
  };
}

let admin, shopper, demo, guest;
let guitar, bass;

before(async () => {
  await new Promise((r) => paypal.listen(0, r));
  process.env.PAYPAL_API_URL = `http://127.0.0.1:${paypal.address().port}`;
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  const adminUser = await User.create({ name: "Admin", email: "admin@test.com", password: "admin-pass-1", isAdmin: true });
  await User.create({ name: "Demo Admin", email: "demo@test.com", password: "demo-pass-1", isAdmin: true, isDemo: true });
  [guitar, bass] = await Product.insertMany([
    { user: adminUser._id, name: "Gibson Les Paul", image: "/i.jpg", brand: "Gibson", category: "Electric Guitars", description: "d", condition: "good", price: 1000, countInStock: 2 },
    { user: adminUser._id, name: "Fender P-Bass (1977)", image: "/i.jpg", brand: "Fender", category: "Bass Guitars", description: "d", condition: "Like New", price: 40, countInStock: 5 },
  ]);

  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
  admin = client();
  shopper = client();
  demo = client();
  guest = client();
  await admin("POST", "/api/users/auth", { email: "admin@test.com", password: "admin-pass-1" });
  await demo("POST", "/api/users/auth", { email: "demo@test.com", password: "demo-pass-1" });
});

after(async () => {
  server?.close();
  paypal.close();
  await mongoose.disconnect();
});

test("lists, searches, filters and sorts products", async () => {
  let r = await guest("GET", "/api/products");
  assert.equal(r.status, 200);
  assert.equal(r.data.count, 2);
  assert.equal(r.data.products[0].reviews, undefined, "list omits reviews");

  r = await guest("GET", "/api/products?keyword=" + encodeURIComponent("P-Bass (1977)"));
  assert.equal(r.data.count, 1, "regex special characters are matched literally");

  r = await guest("GET", "/api/products?keyword=" + encodeURIComponent("(((a+)+)+$"));
  assert.equal(r.status, 200, "malicious regex doesn't crash");

  r = await guest("GET", "/api/products?category=Bass%20Guitars");
  assert.deepEqual(r.data.products.map((p) => p.name), ["Fender P-Bass (1977)"]);

  r = await guest("GET", "/api/products?sort=price-asc");
  assert.equal(r.data.products[0].price, 40);

  r = await guest("GET", "/api/products/filters");
  assert.equal(r.data.categories.length, 2);
});

test("normalizes legacy lowercase conditions", async () => {
  const p = await Product.findById(guitar._id);
  assert.equal(p.condition, "Good");
});

test("registers, signs in, and keeps the password working after a profile edit", async () => {
  let r = await shopper("POST", "/api/users", { name: "Shopper", email: "Shop@Test.com", password: "short" });
  assert.equal(r.status, 400, "rejects short passwords");

  r = await shopper("POST", "/api/users", { name: "Shopper", email: "Shop@Test.com", password: "shopper-pass" });
  assert.equal(r.status, 201);
  assert.equal(r.data.email, "shop@test.com");
  assert.equal(r.data.password, undefined);

  r = await shopper("PUT", "/api/users/profile", { name: "Shopper Renamed" });
  assert.equal(r.status, 200);

  // Regression: the old pre-save hook re-hashed the hash on every save.
  const fresh = client();
  r = await fresh("POST", "/api/users/auth", { email: "shop@test.com", password: "shopper-pass" });
  assert.equal(r.status, 200, "password still valid after profile update");

  r = await fresh("POST", "/api/users/auth", { email: "shop@test.com", password: "wrong" });
  assert.equal(r.status, 401);
});

test("protects admin routes", async () => {
  assert.equal((await guest("GET", "/api/users")).status, 401);
  assert.equal((await shopper("GET", "/api/users")).status, 403);
  assert.equal((await admin("GET", "/api/users")).status, 200);
  assert.equal((await guest("POST", "/api/upload")).status, 401, "uploads need auth");
});

test("demo accounts can look but not touch", async () => {
  assert.equal((await demo("GET", "/api/orders")).status, 200, "demo admin can view orders");
  const r = await demo("PUT", `/api/products/${guitar._id}`, { price: 1 });
  assert.equal(r.status, 403);
  assert.match(r.data.message, /read-only/);
  assert.equal((await demo("PUT", "/api/users/profile", { name: "x" })).status, 403);
  assert.equal((await Product.findById(guitar._id)).price, 1000);
});

test("creates orders with server-side prices and stock checks, then pays via PayPal", async () => {
  // Client lies about the price; the server ignores it.
  let r = await shopper("POST", "/api/orders", {
    orderItems: [{ _id: String(bass._id), qty: 2, price: 0.01 }],
    shippingAddress: { address: "1 Rock St", city: "Erie", postalCode: "16501", country: "USA" },
    paymentMethod: "PayPal",
  });
  assert.equal(r.status, 201);
  const order = r.data;
  assert.equal(order.itemsPrice, 80);
  assert.equal(order.shippingPrice, 10);
  assert.equal(order.taxPrice, 12);
  assert.equal(order.totalPrice, 102);

  r = await shopper("POST", "/api/orders", {
    orderItems: [{ _id: String(guitar._id), qty: 5 }],
    shippingAddress: { address: "a", city: "b", postalCode: "c", country: "d" },
  });
  assert.equal(r.status, 400, "can't order more than in stock");

  // Other users can't see the order.
  assert.equal((await admin("GET", `/api/orders/${order._id}`)).status, 200);
  const stranger = client();
  await stranger("POST", "/api/users", { name: "S", email: "s@test.com", password: "stranger-pass" });
  assert.equal((await stranger("GET", `/api/orders/${order._id}`)).status, 404);

  // Wrong amount is rejected.
  paypalOrders.WRONG = { status: "COMPLETED", value: "1.00" };
  r = await shopper("PUT", `/api/orders/${order._id}/pay`, { id: "WRONG", payer: {} });
  assert.equal(r.status, 400);

  // Whole-dollar totals: "102.00" from PayPal must match 102 (bug in the old code).
  paypalOrders.GOOD = { status: "COMPLETED", value: "102.00" };
  r = await shopper("PUT", `/api/orders/${order._id}/pay`, { id: "GOOD", status: "COMPLETED", payer: { email_address: "p@x.com" } });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  assert.equal(r.data.isPaid, true);
  assert.equal((await Product.findById(bass._id)).countInStock, 3, "stock decremented");

  // Same transaction can't be reused.
  r = await shopper("PUT", `/api/orders/${order._id}/pay`, { id: "GOOD", payer: {} });
  assert.equal(r.status, 400);

  // Admin ships it; summary reflects revenue.
  r = await admin("PUT", `/api/orders/${order._id}/deliver`);
  assert.equal(r.data.isDelivered, true);
  r = await admin("GET", "/api/orders/summary");
  assert.equal(r.data.revenue, 102);
  assert.equal(r.data.paidOrders, 1);
});

test("reviews: one per user, updates rating", async () => {
  let r = await shopper("POST", `/api/products/${guitar._id}/reviews`, { rating: 4, comment: "Great tone" });
  assert.equal(r.status, 201);
  r = await shopper("POST", `/api/products/${guitar._id}/reviews`, { rating: 5, comment: "again" });
  assert.equal(r.status, 400);
  r = await guest("GET", `/api/products/${guitar._id}`);
  assert.equal(r.data.rating, 4);
  assert.equal(r.data.numReviews, 1);
});

test("returns 404s for bad ids and unknown routes", async () => {
  assert.equal((await guest("GET", "/api/products/not-an-id")).status, 404);
  assert.equal((await guest("GET", "/api/nope")).status, 404);
});
