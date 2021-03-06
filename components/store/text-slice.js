import { createSlice } from "@reduxjs/toolkit";

export const textSlice = createSlice({
  name: "text",
  initialState: {
    titleLength: 0,
    summaryLength: 0,
    postDesc: "",
    aboutMe: "",
    textLength: 0,
    message: {},
  },
  reducers: {
    titleCount(state, action) {
      const count = action.payload;
      state.titleLength = count;
    },
    summaryCount(state, action) {
      const count = action.payload;
      state.summaryLength = count;
    },
    textCount(state, action) {
      const count = action.payload;
      state.textLength = count;
    },
    setDesc(state, action) {
      const data = action.payload;
      state.postDesc = data;
    },
    reset(state) {
      state.postDesc = "";
      state.summaryLength = 0;
      state.titleLength = 0;
      state.aboutMe = "";
      state.textLength = 0;
      state.message = {};
    },
    setAboutMe(state, action) {
      const data = action.payload;
      state.aboutMe = data;
    },
    editAboutMe(state, action) {
      const data = action.payload;
      state.aboutMe = data;
    },
    submitErrorMsg(state, action) {
      const data = action.payload;
      state.message.error = data;
    },
    submitSuccessMsg(state, action) {
      const data = action.payload;
      state.message.success = data;
    },
  },
});

export const textActions = textSlice.actions;
