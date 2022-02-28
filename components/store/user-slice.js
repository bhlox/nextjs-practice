import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: { isLoggedIn: false, checkingStatus: true },
  reducers: {
    verify(state) {
      state.checkingStatus = true;
    },
    verifyComplete(state) {
      state.checkingStatus = false;
    },
    success(state) {
      state.isLoggedIn = true;
      state.checkingStatus = false;
    },
    noUser(state) {
      state.isLoggedIn = false;
      state.checkingStatus = false;
    },
  },
});

export const userActions = userSlice.actions;
