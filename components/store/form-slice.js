import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
  name: "postForm",
  initialState: {
    formInputs: {
      category: "",
      title: "",
      image: "",
      descCount: 0,
      summary: "",
    },
    validity: {
      category: true,
      title: true,
      image: true,
      descCount: true,
      summary: true,
    },
    isFormValid: true,
  },
  reducers: {
    missing(state, action) {
      const data = action.payload;
      state.formInputs = { ...state.formInputs, ...data };
      Object.entries(data).forEach((arr) => {
        const [key, value] = arr;
        state.validity[key] = (value?.length > 2 || value >= 50) ?? false;
      });
      state.isFormValid = false;
    },
    submit(state, action) {
      const data = action.payload;
      const [key, value] = Object.entries(data).flat();
      state.formInputs = { ...state.formInputs, [key]: value };
      state.validity[key] = (value?.length > 2 || value >= 50) ?? false;
      state.isFormValid = Object.values(state.validity).every(
        (entry) => entry === true
      );
    },
    reset(state) {
      state.validity = {
        category: true,
        title: true,
        image: true,
        descCount: true,
        summary: true,
      };
      state.isFormValid = true;
    },
  },
});

export const formActions = formSlice.actions;
