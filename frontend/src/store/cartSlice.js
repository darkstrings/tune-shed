import { createSelector, createSlice } from "@reduxjs/toolkit";
import { load } from "./storage";
import { logout } from "./authSlice";
import { calcPrices } from "../lib/prices";

const empty = { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState: { ...empty, ...load("tuneshed:cart", {}) },
  reducers: {
    addToCart: (state, { payload }) => {
      const { _id, name, image, price, countInStock, brand, condition } = payload;
      const qty = Math.max(1, Math.min(payload.qty ?? 1, countInStock || 1));
      const item = { _id, name, image, price, countInStock, brand, condition, qty };
      const i = state.cartItems.findIndex((x) => x._id === _id);
      if (i >= 0) state.cartItems[i] = item;
      else state.cartItems.push(item);
    },
    removeFromCart: (state, { payload: id }) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== id);
    },
    saveShippingAddress: (state, { payload }) => {
      state.shippingAddress = payload;
    },
    savePaymentMethod: (state, { payload }) => {
      state.paymentMethod = payload;
    },
    clearCartItems: (state) => {
      state.cartItems = [];
    },
  },
  // Signing out clears the cart so the next person on this browser starts fresh.
  extraReducers: (builder) => builder.addCase(logout, () => empty),
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;

export const selectCart = (s) => s.cart;
export const selectCartCount = (s) => s.cart.cartItems.reduce((a, i) => a + i.qty, 0);
export const selectCartPrices = createSelector([(s) => s.cart.cartItems], (items) => calcPrices(items));

export default cartSlice.reducer;
