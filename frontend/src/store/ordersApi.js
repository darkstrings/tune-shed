import { apiSlice } from "./apiSlice";

const ORDERS = "/api/orders";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    createOrder: b.mutation({
      query: (body) => ({ url: ORDERS, method: "POST", body }),
      invalidatesTags: ["Order", "Summary"],
    }),
    getOrderDetails: b.query({ query: (id) => `${ORDERS}/${id}`, providesTags: (r, e, id) => [{ type: "Order", id }] }),
    payOrder: b.mutation({
      query: ({ orderId, details }) => ({ url: `${ORDERS}/${orderId}/pay`, method: "PUT", body: details }),
      invalidatesTags: (r, e, { orderId }) => [{ type: "Order", id: orderId }, "Order", "Summary", "Product"],
    }),
    deliverOrder: b.mutation({
      query: (orderId) => ({ url: `${ORDERS}/${orderId}/deliver`, method: "PUT" }),
      invalidatesTags: (r, e, orderId) => [{ type: "Order", id: orderId }, "Order", "Summary"],
    }),
    getPaypalClientId: b.query({ query: () => "/api/config/paypal" }),
    getMyOrders: b.query({ query: () => `${ORDERS}/mine`, providesTags: ["Order"] }),
    getOrders: b.query({ query: () => ORDERS, providesTags: ["Order"] }),
    getSummary: b.query({ query: () => `${ORDERS}/summary`, providesTags: ["Summary"] }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useGetSummaryQuery,
} = ordersApi;
