// import { createSlice } from "@reduxjs/toolkit";

// export const homePostsSlice = createSlice({
//   name: "homePosts",
//   initialState: {
//     latestPosts: [],
//     randomPosts: [],
//     recentPosts: [],
//     lastPost: "",
//   },
//   reducers: {
//     setLatestPosts(state, action) {
//       const data = action.payload;
//       state.latestPosts = data;
//     },
//     setRandomPosts(state, action) {
//       const data = action.payload;
//       state.randomPosts = data;
//     },
//     setInitialRecentPosts(state, action) {
//       const data = action.payload;
//       state.recentPosts = data;
//     },
//     fetchMorePosts(state, action) {
//       const data = action.payload;
//       data.forEach((entry) => {
//         state.recentPosts.push(entry);
//       });
//     },
//     setLastPost(state, action) {
//       const data = action.payload;
//       state.lastPost = data;
//     },
//   },
// });

// export const homePostsActions = homePostsSlice.actions;
