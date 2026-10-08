const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const money = (n) => usd.format(Number(n) || 0);

export const shortDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export const shortId = (id = "") => `#${String(id).slice(-6).toUpperCase()}`;

const WAKING = new Set([502, 503, 504, "FETCH_ERROR", "TIMEOUT_ERROR"]);

/** Readable message from an RTK Query error. */
export function errMsg(err) {
  if (err?.data?.message) return err.data.message;
  if (WAKING.has(err?.status) || WAKING.has(err?.originalStatus))
    return "The store's server is taking longer than usual to wake up. Please refresh the page in a moment.";
  return err?.error || err?.message || "Something went wrong";
}
