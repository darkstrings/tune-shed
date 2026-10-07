const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const money = (n) => usd.format(Number(n) || 0);

export const shortDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export const shortId = (id = "") => `#${String(id).slice(-6).toUpperCase()}`;

/** Readable message from an RTK Query error. */
export const errMsg = (err) => err?.data?.message || err?.error || err?.message || "Something went wrong";
