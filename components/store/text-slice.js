import { createSlice } from "@reduxjs/toolkit";

export const textSlice = createSlice({
  name: "text",
  initialState: { textLength: 0 },
  reducers: {
    count(state, action) {
      const count = action.payload;
      state.textLength = count;
    },
  },
});

export const textActions = textSlice.actions;
