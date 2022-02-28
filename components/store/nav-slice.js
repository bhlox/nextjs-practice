import { createSlice } from "@reduxjs/toolkit";

export const navSlice = createSlice({
  name: "nav",
  initialState: { showSide: false },
  reducers: {
    toggle(state) {
      state.showSide = !state.showSide;
    },
    close(state) {
      state.showSide = false;
    },
  },
});

export const navActions = navSlice.actions;
