import { createSlice } from "@reduxjs/toolkit";

export const navSlice = createSlice({
  name: "nav",
  initialState: {
    showSide: false,
    showProfileOptions: false,
    showBlogOptions: false,
    showSearch: false,
    isSearchBarFocus: false,
  },
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
    toggleBlogs(state) {
      state.showBlogOptions = !state.showBlogOptions;
    },
    closeBlogs(state) {
      state.showBlogOptions = false;
    },
    toggleSearch(state) {
      state.showSearch = !state.showSearch;
    },
    openSearch(state) {
      state.showSearch = true;
    },
    closeSearch(state) {
      state.showSearch = false;
    },
    focusSearch(state) {
      state.isSearchBarFocus = true;
    },
    blurSearch(state) {
      state.isSearchBarFocus = false;
    },
  },
});

export const navActions = navSlice.actions;
