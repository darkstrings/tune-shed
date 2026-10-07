// Usage:
//   npm run data:import        wipe everything and load sample data
//   npm run data:destroy       wipe everything
//   npm run data:demo-users    add/refresh only the read-only demo accounts (safe for production)
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const { default: mongoose } = await import("mongoose");
const { default: connectDB } = await import("./config/db.js");
const { default: User } = await import("./models/userModel.js");
const { default: Product } = await import("./models/productModel.js");
const { default: Order } = await import("./models/orderModel.js");
const { default: products } = await import("./data/products.js");
const { adminUser, demoUsers, sampleCustomers } = await import("./data/users.js");

async function upsertDemoUsers() {
  for (const demo of demoUsers) {
    const existing = await User.findOne({ email: demo.email });
    if (existing) {
      Object.assign(existing, demo);
      await existing.save();
    } else {
      await User.create(demo);
    }
  }
  console.log(`✔ Demo accounts ready: ${demoUsers.map((u) => u.email).join(", ")} (password: ${demoUsers[0].password})`);
}

async function importData() {
  await Promise.all([Order.deleteMany(), Product.deleteMany(), User.deleteMany()]);
  const admin = await User.create(adminUser);
  const customers = [];
  for (const u of sampleCustomers) customers.push(await User.create(u));
  await upsertDemoUsers();

  // Give each product a couple of real reviews so ratings match what's on the page.
  await Product.insertMany(
    products.map(({ sampleReviews = [], ...p }) => {
      const reviews = sampleReviews.map((r, i) => ({
        name: customers[i % customers.length].name,
        user: customers[i % customers.length]._id,
        rating: r.rating,
        comment: r.comment,
      }));
      const rating = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
      return { ...p, user: admin._id, reviews, numReviews: reviews.length, rating };
    }),
  );
  console.log(`✔ Data imported. Admin: ${adminUser.email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) console.log(`  Generated admin password: ${adminUser.password}`);
}

async function destroyData() {
  await Promise.all([Order.deleteMany(), Product.deleteMany(), User.deleteMany()]);
  console.log("✔ Data destroyed");
}

await connectDB();
try {
  const flag = process.argv[2];
  if (flag === "-d") await destroyData();
  else if (flag === "--demo-users") await upsertDemoUsers();
  else await importData();
} catch (err) {
  console.error(`✖ ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
