import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    commentList: [],
    userCommentOwner: false,
    content: "",
    commentsId: [],
  },
  reducers: {
    setCommentList(state, action) {
      const data = action.payload;
      state.commentList = data;
    },
    isUserCommentOwner(state, action) {
      const data = action.payload;
      state.userCommentOwner = data;
    },
    setContent(state, action) {
      const data = action.payload;
      state.content = data;
    },
    resetContent(state) {
      state.content = "";
    },
    setCommentsId(state, action) {
      const data = action.payload;
      state.commentsId = data;
    },
    addIdToComments(state, action) {
      const data = action.payload;
      state.commentsId = [...state.commentsId, data];
    },
    deleteIdFromComments(state, action) {
      const data = action.payload;
      state.commentsId = state.commentsId.filter((id) => data !== id);
    },
    reset(state) {
      state.content = "";
      state.commentsId = [];
      state.commentList = [];
      state.userCommentOwner = false;
    },
  },
});

export const commentsActions = commentsSlice.actions;
