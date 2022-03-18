import { createSlice } from "@reduxjs/toolkit";

const signupFormSlice = createSlice({
  name: "signup",
  initialState: { name: "", username: "", email: "", password: "" },
  reducers: {},
});
