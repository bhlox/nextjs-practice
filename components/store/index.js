import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user-slice";
import { navSlice } from "./nav-slice";
import { textSlice } from "./text-slice";
import { imageSlice } from "./image-slice";
import { uiSlice } from "./ui-slice";
import { formSlice } from "./form-slice";
import { accountFormSlice } from "./account-form-slice";
import { homePostsSlice } from "./home-posts-slice";
import { commentsSlice } from "./comments-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    nav: navSlice.reducer,
    text: textSlice.reducer,
    image: imageSlice.reducer,
    ui: uiSlice.reducer,
    form: formSlice.reducer,
    accountForm: accountFormSlice.reducer,
    comments: commentsSlice.reducer,
    // homePosts: homePostsSlice.reducer,
  },
});

export default store;
