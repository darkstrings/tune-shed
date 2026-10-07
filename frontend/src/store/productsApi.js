import { apiSlice } from "./apiSlice";

const PRODUCTS = "/api/products";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    getProducts: b.query({
      query: (params) => ({ url: PRODUCTS, params }),
      providesTags: (res) => [
        ...(res?.products ?? []).map((p) => ({ type: "Product", id: p._id })),
        { type: "Product", id: "LIST" },
      ],
    }),
    getFilters: b.query({ query: () => `${PRODUCTS}/filters`, providesTags: [{ type: "Product", id: "LIST" }] }),
    getTopProducts: b.query({ query: () => `${PRODUCTS}/top`, providesTags: [{ type: "Product", id: "LIST" }] }),
    getProductDetails: b.query({
      query: (id) => `${PRODUCTS}/${id}`,
      providesTags: (r, e, id) => [{ type: "Product", id }],
    }),
    createProduct: b.mutation({
      query: () => ({ url: PRODUCTS, method: "POST" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }, "Summary"],
    }),
    updateProduct: b.mutation({
      query: ({ productId, ...body }) => ({ url: `${PRODUCTS}/${productId}`, method: "PUT", body }),
      invalidatesTags: (r, e, { productId }) => [{ type: "Product", id: productId }, { type: "Product", id: "LIST" }, "Summary"],
    }),
    uploadProductImage: b.mutation({
      query: (formData) => ({ url: "/api/upload", method: "POST", body: formData }),
    }),
    deleteProduct: b.mutation({
      query: (id) => ({ url: `${PRODUCTS}/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }, "Summary"],
    }),
    createReview: b.mutation({
      query: ({ productId, ...body }) => ({ url: `${PRODUCTS}/${productId}/reviews`, method: "POST", body }),
      invalidatesTags: (r, e, { productId }) => [{ type: "Product", id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFiltersQuery,
  useGetTopProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
} = productsApi;
