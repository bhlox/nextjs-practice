import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
  name: "postForm",
  initialState: {
    formInputs: {
      category: "",
      title: "",
      image: true,
      desc: true,
      summary: true,
    },
    validity: {
      category: true,
      title: true,
      image: true,
      desc: true,
      summary: true,
    },
  },
  reducers: {
    missing(state, action) {
      const data = action.payload;
      state.formInputs = data;
      Object.entries(data).forEach((arr) => {
        const [key, value] = arr;
        state.validity[key] = value?.length > 2 ?? false;
      });
    },
    submit(state, action) {
      const data = action.payload;
      state.formInputs = { ...data };
      const [key, value] = Object.entries(data).flat();
      state.validity[key] = value.length > 2;
    },
  },
});

export const formActions = formSlice.actions;
