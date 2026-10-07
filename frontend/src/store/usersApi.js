import { apiSlice } from "./apiSlice";

const USERS = "/api/users";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation({ query: (body) => ({ url: `${USERS}/auth`, method: "POST", body }) }),
    register: b.mutation({ query: (body) => ({ url: USERS, method: "POST", body }) }),
    logout: b.mutation({ query: () => ({ url: `${USERS}/logout`, method: "POST" }) }),
    profile: b.mutation({ query: (body) => ({ url: `${USERS}/profile`, method: "PUT", body }) }),
    getUsers: b.query({ query: () => USERS, providesTags: ["User"] }),
    getUserDetails: b.query({ query: (id) => `${USERS}/${id}`, providesTags: (r, e, id) => [{ type: "User", id }] }),
    updateUser: b.mutation({
      query: ({ userId, ...body }) => ({ url: `${USERS}/${userId}`, method: "PUT", body }),
      invalidatesTags: ["User"],
    }),
    deleteUser: b.mutation({
      query: (id) => ({ url: `${USERS}/${id}`, method: "DELETE" }),
      invalidatesTags: ["User", "Summary"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
