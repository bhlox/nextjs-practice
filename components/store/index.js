import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user-slice";
import { navSlice } from "./nav-slice";
import { textSlice } from "./text-slice";
import { imageSlice } from "./image-slice";
import { uiSlice } from "./ui-slice";
import { formSlice } from "./form-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    nav: navSlice.reducer,
    text: textSlice.reducer,
    image: imageSlice.reducer,
    ui: uiSlice.reducer,
    form: formSlice.reducer,
  },
});

export default store;
