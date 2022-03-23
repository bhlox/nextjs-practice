import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    currentPostId: "",
    currentUserData: { userpic: "", commentsIds: [], repliesIds: [] },
    commentList: [],
    userCommentOwner: false,
    content: "",
    commentsId: [],
    isEditing: false,
    activeCommentId: "",
    contentToEdit: "",
    isReplying: false,
    activeReplyId: "",
  },
  reducers: {
    setCurrentUserData(state, action) {
      state.currentUserData = action.payload;
    },
    updateCurrentUserDataField(state, action) {
      const data = action.payload;
      const [key, value] = Object.entries(data).flat();
      state.currentUserData[key] = [...state.currentUserData[key], value];
    },
    setCurrentPostId(state, action) {
      state.currentPostId = action.payload;
    },
    setCommentList(state, action) {
      state.commentList = action.payload;
    },
    isUserCommentOwner(state, action) {
      state.userCommentOwner = action.payload;
    },
    setContent(state, action) {
      state.content = action.payload;
    },
    resetContent(state) {
      state.content = "";
    },
    setCommentsId(state, action) {
      state.commentsId = action.payload;
    },
    addIdToComments(state, action) {
      const data = action.payload;
      state.commentsId = [...state.commentsId, data];
    },
    deleteIdFromComments(state, action) {
      const data = action.payload;
      state.commentsId = state.commentsId.filter((id) => data !== id);
    },
    editingContent(state) {
      state.isEditing = true;
    },
    setContentToEdit(state, action) {
      state.contentToEdit = action.payload;
    },

    cancelEditing(state) {
      state.isEditing = false;
    },
    setActiveCommentId(state, action) {
      state.activeCommentId = action.payload;
    },
    setIsReplying(state, action) {
      state.isReplying = action.payload;
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
