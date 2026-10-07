import { createSlice } from "@reduxjs/toolkit";
import { load } from "./storage";

// The real session is the HTTP-only cookie; this is just who to show in the UI.
const authSlice = createSlice({
  name: "auth",
  initialState: { userInfo: load("tuneshed:user", null) },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
