import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import cartReducer from "./cartSlice";
import authReducer, { logout } from "./authSlice";
import { save } from "./storage";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(apiSlice.middleware, (api) => (next) => (action) => {
      const result = next(action);
      // Forget cached private data when someone signs out.
      if (logout.match(action)) api.dispatch(apiSlice.util.resetApiState());
      return result;
    }),
});

// Persist cart + signed-in user between visits.
let prev;
store.subscribe(() => {
  const { cart, auth } = store.getState();
  if (cart !== prev?.cart) save("tuneshed:cart", cart);
  if (auth !== prev?.auth) save("tuneshed:user", auth.userInfo);
  prev = { cart, auth };
});
