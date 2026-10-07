import dotenv from "dotenv";
dotenv.config({ quiet: true });

const { default: app } = await import("./app.js");
const { default: connectDB } = await import("./config/db.js");

const port = process.env.PORT || 5000;

await connectDB();
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV ?? "development"} mode on port ${port}`));
