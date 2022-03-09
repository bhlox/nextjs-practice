import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showModal: false,
    isUpdating: false,
    showEdit: false,
    isEditingUserName: false,
  },
  reducers: {
    toggle(state) {
      state.showModal = !state.showModal;
    },
    show(state) {
      state.showModal = true;
    },
    hide(state) {
      state.showModal = false;
    },
    updating(state) {
      state.isUpdating = true;
    },
    updated(state) {
      state.isUpdating = false;
    },
    editing(state) {
      state.showEdit = true;
    },
    edited(state) {
      state.showEdit = false;
    },
    editingUserName(state) {
      state.isEditingUserName = true;
    },
    editedUserName(state) {
      state.isEditingUserName = false;
    },
  },
});

export const uiActions = uiSlice.actions;
