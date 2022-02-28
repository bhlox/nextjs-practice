import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user-slice";
import { navSlice } from "./nav-slice";

const store = configureStore({
  reducer: { user: userSlice.reducer, nav: navSlice.reducer },
});

export default store;
