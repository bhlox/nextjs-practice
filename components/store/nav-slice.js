import { createSlice } from "@reduxjs/toolkit";

export const navSlice = createSlice({
  name: "nav",
  initialState: { showSide: false, showProfileOptions: false },
  reducers: {
    toggle(state) {
      state.showSide = !state.showSide;
    },
    close(state) {
      state.showSide = false;
    },
    toggleProfile(state) {
      state.showProfileOptions = !state.showProfileOptions;
    },
    closeProfile(state) {
      state.showProfileOptions = false;
    },
  },
});

export const navActions = navSlice.actions;
