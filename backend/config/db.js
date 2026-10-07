import dns from "node:dns";
import mongoose from "mongoose";

// Optional: comma-separated DNS servers to use, e.g. DNS_SERVERS=1.1.1.1,8.8.8.8
if (process.env.DNS_SERVERS) dns.setServers(process.env.DNS_SERVERS.split(",").map((s) => s.trim()));

// "mongodb+srv://" addresses need a DNS SRV lookup. Some home routers/ISPs (and Node on
// Windows) refuse those lookups with "querySrv ECONNREFUSED". When that happens we retry
// once using public DNS resolvers.
const isSrvLookupError = (err) => /querySrv|ECONNREFUSED _mongodb|ETIMEOUT _mongodb/i.test(err?.message ?? "");

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (isSrvLookupError(error) && !process.env.DNS_SERVERS) {
      console.warn("MongoDB SRV lookup failed with the system DNS — retrying with public DNS (1.1.1.1, 8.8.8.8)…");
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return;
      } catch (retryError) {
        error = retryError;
      }
    }
    console.error(`MongoDB connection error: ${error.message}`);
    if (/whitelist|IP address|ReplicaSetNoPrimary|Server selection timed out/i.test(error.message)) {
      console.error("Tip: in MongoDB Atlas → Network Access, make sure your current IP address is allowed.");
    }
    process.exit(1);
  }
}
