import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import nookies from "nookies";
import Head from "next/head";

import { GiDialPadlock } from "react-icons/gi";
import { GoEye } from "react-icons/go";
import { TiWarning } from "react-icons/ti";
import { HiCheckCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../components/store/user-slice";
import { db } from "../../firebase.config";
import { uiActions } from "../../components/store/ui-slice";
import { textActions } from "../../components/store/text-slice";

const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;

function ChangeLoginInfo() {
  const auth = getAuth();

  const currentPasswordInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();

  const dispatch = useDispatch();

  const showPassword = useSelector((state) => state.user.showPassword);
  const { load } = useSelector((state) => state.ui);
  const { message } = useSelector((state) => state.text);

  useEffect(() => {
    return () => dispatch(textActions.reset());
  }, [dispatch]);

  const handleShow = () => {
    dispatch(userActions.show());
    passwordInputRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(uiActions.loading());
    // const userRef = doc(db, "users", auth.currentUser.uid);

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPasswordInputRef.current.value
    );

    try {
      const result = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );

      if (
        passwordConfirmInputRef.current.value.length <= 5 ||
        passwordInputRef.current.value.length <= 5
      ) {
        throw new Error("Firebase: Error (auth/password-too-short)");
      }

      if (!format.test(passwordConfirmInputRef.current.value)) {
        throw new Error("Firebase: Error (auth/password-is-weak)");
      }
      if (
        passwordConfirmInputRef.current.value !== passwordInputRef.current.value
      ) {
        throw new Error("Firebase: Error (auth/new-passwords-do-not-match)");
      }

      await updatePassword(
        auth.currentUser,
        passwordConfirmInputRef.current.value
      );
      dispatch(textActions.submitErrorMsg(""));
      dispatch(textActions.submitSuccessMsg("Password successfully updated!"));
      dispatch(uiActions.loaded());
    } catch (error) {
      const errorMsg = error
        .toString()
        ?.split(" ")
        ?.slice(-1)
        ?.toString()
        ?.replace(/[^a-zA-Z ]/g, " ");
      dispatch(textActions.submitErrorMsg(errorMsg));
      dispatch(textActions.submitSuccessMsg(""));
      dispatch(uiActions.loaded());
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Change current password</title>
        <link rel="icon" href="/newreadit.png" />
      </Head>
      <div className="flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold">Change current password</h2>
        </div>
        <form
          className="mt-8 flex flex-col space-y-16 items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative max-w-max">
            <input
              className="styled-input"
              type={showPassword ? "text" : "password"}
              ref={currentPasswordInputRef}
              id="currentPassword"
              placeholder="enter current password"
              // onChange={handleData}
            />
            <GiDialPadlock className="input-icon" />
            <GoEye
              onClick={handleShow}
              className={`absolute right-0 top-0 text-3xl md:text-5xl ${
                showPassword ? "text-red-500" : "text-purple-600"
              }  cursor-pointer `}
            />
          </div>

          <div className="relative max-w-max">
            <input
              className="styled-input"
              type={showPassword ? "text" : "password"}
              ref={passwordInputRef}
              id="password"
              placeholder="enter new password"
              // onChange={handleData}
            />
            <GiDialPadlock className="input-icon" />
            <GoEye
              onClick={handleShow}
              className={`absolute right-0 top-0 text-3xl md:text-5xl ${
                showPassword ? "text-red-500" : "text-purple-600"
              }  cursor-pointer `}
            />
          </div>

          <div className="relative max-w-max">
            <input
              className="styled-input"
              type={showPassword ? "text" : "password"}
              ref={passwordConfirmInputRef}
              id="passwordConfirm"
              placeholder="confirm password"
              // onChange={handleData}
            />
            <GiDialPadlock className="input-icon" />
            <GoEye
              onClick={handleShow}
              className={`absolute right-0 top-0 text-3xl md:text-5xl ${
                showPassword ? "text-red-500" : "text-purple-600"
              }  cursor-pointer `}
            />
          </div>
          {load && (
            <div>
              <h2 className="text-2xl text-bold">Loading...</h2>
            </div>
          )}
          {!load && message.success && (
            <div className="text-3xl flex items-center space-x-1">
              <HiCheckCircle className="text-green-400" />
              <h2>{message.success}</h2>
            </div>
          )}
          {!load && message.error && (
            <div className="flex items-center space-x-1 text-3xl ">
              <TiWarning className="text-yellow-400" />
              <h2 className="text-red-400 font-bold">{message.error}</h2>
            </div>
          )}
          {!load && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 rounded-3xl text-3xl hover:bg-purple-700 w-full"
            >
              Save
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default ChangeLoginInfo;

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  try {
    if (!cookies.token) throw new Error("yes");
    return { props: {} };
  } catch (error) {
    context.res.writeHead(302, { Location: "/sign-in" });
    context.res.end();

    return { props: {} };
  }
}
