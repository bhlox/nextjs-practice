import React, { useEffect, useRef, useState } from "react";
import { VscOctoface } from "react-icons/vsc";
import { GiDialPadlock } from "react-icons/gi";
import { GoEye, GoPerson } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import { TiWarning } from "react-icons/ti";
import { HiCheckCircle } from "react-icons/hi";

import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import {
  serverTimestamp,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import Head from "next/head";

import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";

import nookies from "nookies";
import { useSelector } from "react-redux";
import GoogleAuth from "../../components/GoogleAuth";
import { accountFormActions } from "../../components/store/account-form-slice";
import { uiActions } from "../../components/store/ui-slice";

function SignUp() {
  const showPassword = useSelector((state) => state.user.showPassword);

  const router = useRouter();

  const passwordInputRef = useRef();

  const auth = getAuth();
  const dispatch = useDispatch();

  const { accountInfo } = useSelector((state) => state.accountForm);
  const { validity } = useSelector((state) => state.accountForm);
  const { lengthValidity } = useSelector((state) => state.accountForm);
  const { exists } = useSelector((state) => state.accountForm);
  const { specialCharacters } = useSelector((state) => state.accountForm);
  const { signUpValidity } = useSelector((state) => state.accountForm);
  const { load } = useSelector((state) => state.ui);

  const usersRef = collection(db, "users");

  useEffect(() => {
    dispatch(userActions.hide());

    return () => dispatch(accountFormActions.reset());
  }, [dispatch]);

  const handleData = async (e) => {
    if (e.target.id === "fullName") {
      dispatch(
        accountFormActions.submitInfo({ [e.target.id]: e.target.value })
      );

      dispatch(accountFormActions.isNameHasSpecial());
      dispatch(accountFormActions.isNameLengthValid());
      dispatch(accountFormActions.isNameValid());
    }

    if (e.target.id === "username") {
      dispatch(
        accountFormActions.submitInfo({ [e.target.id]: e.target.value })
      );

      dispatch(accountFormActions.isUsernameLengthValid());

      const userQuery = query(
        usersRef,
        where("username", "==", e.target.value.trim())
      );
      const snapshot = await getDocs(userQuery);
      const taken = snapshot.docs.length !== 0;

      dispatch(accountFormActions.isUsernameTaken(taken));
      dispatch(accountFormActions.isUsernameValid());
    }

    if (e.target.id === "email") {
      dispatch(
        accountFormActions.submitInfo({ [e.target.id]: e.target.value })
      );

      const userQuery = query(
        usersRef,
        where("email", "==", e.target.value.trim())
      );
      const snapshot = await getDocs(userQuery);
      const taken = snapshot.docs.length > 0;

      dispatch(accountFormActions.isEmailTaken(taken));
      dispatch(accountFormActions.isEmailValid());
    }

    if (e.target.id === "password") {
      dispatch(
        accountFormActions.submitInfo({ [e.target.id]: e.target.value })
      );
      dispatch(accountFormActions.isPasswordValid());
    }

    dispatch(accountFormActions.isSignUpValid());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(accountInfo);
    dispatch(uiActions.loading());

    // console.log(formIsValid);
    console.log(
      `handle submit function is called, sign up validity is ${signUpValidity}`
    );

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        accountInfo.email,
        accountInfo.password
      );
      const user = userCredential.user;
      // console.log(formData);
      await updateProfile(auth.currentUser, {
        displayName: accountInfo.username,
        photoURL:
          "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433__480.png",
      });
      const formDataCopy = {
        username: accountInfo.username,
        name: accountInfo.fullName,
        email: accountInfo.email,
        posts: [],
        profilePic:
          "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433__480.png",
        coverPic:
          "https://forum.gameznetwork.com/styles/brivium/ProfileCover/default.jpg",
        socials: {
          facebook: "",
          twitter: "",
          instagram: "",
        },
        aboutMe: "",
        timestamp: serverTimestamp(),
        comments: [],
        replies: [],
      };
      // console.log(formDataCopy);
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      dispatch(uiActions.loaded());
      console.log("registration success");
      dispatch(userActions.success());
      router.push("/profile");
    } catch (error) {
      console.log(error);
      alert(error);
      dispatch(uiActions.loaded());
    }
  };

  const handleShow = () => {
    dispatch(userActions.show());
    passwordInputRef.current.focus();
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
        <link rel="icon" href="/newreadit.png" />
      </Head>

      <div className="flex flex-col items-center">
        <h2 className="text-4xl">Registration form</h2>
        <form
          className="mt-8 flex flex-col space-y-16 items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative max-w-max">
            <input
              className={`styled-input ${
                accountInfo.fullName && !validity.fullName
                  ? "border-red-400 border-b-4"
                  : ""
              }`}
              type="text"
              id="fullName"
              onChange={handleData}
              placeholder="enter full name"
              autoComplete="none"
            />
            <GoPerson className="input-icon" />

            {accountInfo.fullName && validity.fullName && (
              <HiCheckCircle className="text-green-400 text-3xl absolute top-1/2 -translate-y-1/2 right-0" />
            )}

            {accountInfo.fullName && specialCharacters.fullName && (
              <div className="flex gap-x-1 items-center text-2xl font-bold">
                <TiWarning className="text-yellow-400" />
                <p>name contains special characters</p>
              </div>
            )}

            {accountInfo.fullName && !lengthValidity.fullName && (
              <div className="flex gap-x-1 items-center text-2xl font-bold">
                <TiWarning className="text-yellow-400" />
                <p>minimum of 2 letters</p>
              </div>
            )}
          </div>

          <div className="relative max-w-max">
            <input
              className={`styled-input ${
                exists.username ? "border-red-400 border-b-4" : ""
              }`}
              type="text"
              id="username"
              onChange={handleData}
              placeholder="enter username"
              autoComplete="none"
              maxLength={20}
            />
            <VscOctoface className="input-icon" />
            {accountInfo.username &&
              !exists.username &&
              lengthValidity.username && (
                <HiCheckCircle className="text-green-400 text-3xl absolute top-1/2 -translate-y-1/2 right-0" />
              )}
            {accountInfo.username && !lengthValidity.username && (
              <div className="flex gap-x-1 items-center text-2xl font-bold">
                <TiWarning className="text-yellow-400" />
                <p>minimum of 6 characters</p>
              </div>
            )}
            {accountInfo.username &&
              exists.username &&
              lengthValidity.username && (
                <div className="flex gap-x-1 items-center text-2xl font-bold">
                  <TiWarning className="text-yellow-400" />
                  <p>username is taken</p>
                </div>
              )}
          </div>

          <div className="relative max-w-max">
            <input
              className={`styled-input ${
                exists.email || (accountInfo.email && !validity.email)
                  ? "border-red-400 border-b-4"
                  : ""
              }`}
              type="email"
              id="email"
              onChange={handleData}
              placeholder="enter email"
              autoComplete="none"
            />
            <MdEmail className="input-icon" />
            {accountInfo.email && !exists.email && validity.email && (
              <HiCheckCircle className="text-green-400 text-3xl absolute top-1/2 -translate-y-1/2 right-0" />
            )}
            {accountInfo.email && exists.email && (
              <div className="flex gap-x-1 items-center text-2xl font-bold">
                <TiWarning className="text-yellow-400" />
                <p>email address already exists</p>
              </div>
            )}
            {accountInfo.email && !validity.email && (
              <div className="flex gap-x-1 items-center text-2xl font-bold">
                <TiWarning className="text-yellow-400" />
                <p>email invalid</p>
              </div>
            )}
          </div>
          <div className="relative max-w-max">
            <input
              className={`styled-input`}
              type={showPassword ? "text" : "password"}
              ref={passwordInputRef}
              id="password"
              onChange={handleData}
              placeholder="enter password"
            />
            <GiDialPadlock className="input-icon" />
            <GoEye
              onClick={handleShow}
              className={`absolute right-0 top-0 text-3xl md:text-5xl ${
                showPassword ? "text-red-500" : "text-purple-600"
              }  cursor-pointer hover:text-purple-400`}
            />
            {accountInfo.password && validity.password && (
              <HiCheckCircle className="text-green-400 text-3xl absolute top-1/2 -translate-y-1/2 right-10" />
            )}
            {accountInfo.password && !validity.password && (
              <div className="flex gap-x-1 items-center text-2xl font-bold">
                <TiWarning className="text-yellow-400" />
                <p>password is weak</p>
              </div>
            )}
          </div>
          <GoogleAuth sign="up" />
          {!load && (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!signUpValidity}
              className={`px-4 py-2 ${
                signUpValidity
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-transparent"
              }  rounded-3xl text-3xl  w-full outline-2 outline-purple-500 outline`}
            >
              {signUpValidity
                ? "Submit registration"
                : "Pls check your entries"}
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default SignUp;

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  if (!cookies.token) {
    return { props: {} };
  } else {
    context.res.writeHead(302, { Location: "/profile  " });
    context.res.end();

    return { props: {} };
  }
}
