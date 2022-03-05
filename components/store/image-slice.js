import { createSlice } from "@reduxjs/toolkit";

export const imageSlice = createSlice({
  name: "image",
  initialState: { previewImg: "" },
  reducers: {
    setPreview(state, action) {
      const data = action.payload;
      state.previewImg = data;
    },
    reset(state) {
      state.previewImg = "";
    },
  },
});

export const imageActions = imageSlice.actions;
