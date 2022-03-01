import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user-slice";
import { navSlice } from "./nav-slice";
import { textSlice } from "./text-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    nav: navSlice.reducer,
    text: textSlice.reducer,
  },
});

export default store;
