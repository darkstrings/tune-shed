import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";

const baseQuery = fetchBaseQuery({ baseUrl: "", credentials: "include" });

// If the session cookie has expired, drop the stale user from the UI.
async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  if (result.error?.status === 401 && api.getState().auth.userInfo) api.dispatch(logout());
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Product", "Order", "User", "Summary"],
  endpoints: () => ({}),
});
