import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showModal: false,
    isUpdating: false,
    showEdit: false,
    isEditingUserName: false,
    load: false,
    postSent: false,
    darkMode: true,
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
    loading(state) {
      state.load = true;
    },
    loaded(state) {
      state.load = false;
    },
    postSent(state) {
      state.postSent = true;
    },
    resetSent(state) {
      state.postSent = false;
    },
    toggleDark(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("color-theme", !state.darkMode ? "light" : "dark");
    },
    darkModeOn(state) {
      state.darkMode = true;
    },
    darkModeOff(state) {
      state.darkMode = false;
    },
  },
});

export const uiActions = uiSlice.actions;
