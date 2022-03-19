import { createSlice } from "@reduxjs/toolkit";

export const accountFormSlice = createSlice({
  name: "accountForm",
  initialState: {
    accountInfo: { fullName: "", username: "", email: "", password: "" },
    validity: {
      fullName: false,
      username: false,
      email: false,
      password: false,
    },
    lengthValidity: { fullName: false, username: false, password: false },
    exists: { username: false, email: false },
    specialCharacters: { fullName: false },
    signUpValidity: false,
  },
  reducers: {
    submitInfo(state, action) {
      const data = action.payload;
      state.accountInfo = { ...state.accountInfo, ...data };
    },
    isNameHasSpecial(state) {
      const { fullName } = state.accountInfo;
      const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;
      state.specialCharacters.fullName = format.test(fullName);
    },
    isNameLengthValid(state) {
      const { fullName } = state.accountInfo;
      state.lengthValidity.fullName = fullName.length >= 2;
    },
    isNameValid(state) {
      const length = state.lengthValidity.fullName;
      const characters = state.specialCharacters.fullName;
      state.validity.fullName = length && !characters;
    },
    isUsernameLengthValid(state) {
      const { username } = state.accountInfo;
      state.lengthValidity.username = username.length > 5;
    },
    isUsernameTaken(state, action) {
      const data = action.payload;
      state.exists.username = data;
    },
    isUsernameValid(state) {
      const data =
        state.lengthValidity.username && state.exists.username === false;
      state.validity.username = data;
    },
    isEmailTaken(state, action) {
      const data = action.payload;
      state.exists.email = data;
    },
    isEmailValid(state) {
      const { email } = state.accountInfo;
      const emailTaken = state.exists.email;
      state.validity.email = email.match(/..+@.+\...+/) && !emailTaken;
    },
    isPasswordValid(state) {
      const { password } = state.accountInfo;
      const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;
      state.validity.password = format.test(password) && password.length > 5;
    },
    isSignUpValid(state) {
      const allValidity = Object.values(state.validity).every(
        (entry) => entry == true
      );
      state.signUpValidity = allValidity;
    },
    reset(state) {
      state.accountInfo = {};
      state.signUpValidity = false;
    },
  },
});

export const accountFormActions = accountFormSlice.actions;
