import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    checkingStatus: true,
    showPassword: false,
  },
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
    show(state) {
      state.showPassword = !state.showPassword;
    },
    hide(state) {
      state.showPassword = false;
    },
  },
});

export const userActions = userSlice.actions;
