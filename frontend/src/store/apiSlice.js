import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";

const baseQuery = fetchBaseQuery({ baseUrl: "", credentials: "include" });

// The API runs on a free host that sleeps when idle. While it boots, the proxy answers
// with 502/503/504 (or the connection fails), so we keep retrying for a while instead of
// showing an error straight away.
export const WAKE_UP_WINDOW_MS = 120_000;
const RETRYABLE = new Set([502, 503, 504, "FETCH_ERROR", "TIMEOUT_ERROR"]);
const isWakingUp = (e) => Boolean(e) && (RETRYABLE.has(e.status) || RETRYABLE.has(e.originalStatus));
const sleep = (ms, signal) =>
  new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => (clearTimeout(t), resolve()), { once: true });
  });

async function baseQueryWithRetry(args, api, extra) {
  const method = (typeof args === "string" ? "GET" : (args.method ?? "GET")).toUpperCase();
  // Only retry requests that are safe to repeat (reads + sign-in) — never e.g. "place order".
  const canRetry = method === "GET" || api.endpoint === "login";
  const started = Date.now();
  let delay = 2000;

  for (;;) {
    const result = await baseQuery(args, api, extra);
    const outOfTime = Date.now() - started + delay > WAKE_UP_WINDOW_MS;
    if (!canRetry || !isWakingUp(result.error) || outOfTime || api.signal?.aborted) return result;
    await sleep(delay, api.signal);
    delay = Math.min(delay * 1.5, 10_000);
  }
}

// If the session cookie has expired, drop the stale user from the UI.
async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQueryWithRetry(args, api, extra);
  if (result.error?.status === 401 && api.getState().auth.userInfo) api.dispatch(logout());
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Product", "Order", "User", "Summary"],
  endpoints: () => ({}),
});
