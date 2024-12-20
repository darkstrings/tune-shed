import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

import { logout } from "./authSlice"; // Import the logout action

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  } else if (result.error && result.error.status === 500) {
    console.error("Server error:", result.error);
    // You could also display an error message to the user, or retry the request
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth, // Use the customized baseQuery
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({}),
});
