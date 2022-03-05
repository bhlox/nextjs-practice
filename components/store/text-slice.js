import { createSlice } from "@reduxjs/toolkit";

export const textSlice = createSlice({
  name: "text",
  initialState: { titleLength: 0, summaryLength: 0, postDesc: "" },
  reducers: {
    titleCount(state, action) {
      const count = action.payload;
      state.titleLength = count;
    },
    summaryCount(state, action) {
      const count = action.payload;
      state.summaryLength = count;
    },
    setDesc(state, action) {
      const data = action.payload;
      state.postDesc = data;
    },
    reset(state) {
      state.postDesc = "";
      state.summaryLength = 0;
      state.titleLength = 0;
    },
  },
});

export const textActions = textSlice.actions;
