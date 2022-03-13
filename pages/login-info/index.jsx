import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc } from "firebase/firestore";
import React, { useRef } from "react";
import nookies from "nookies";

import { GiDialPadlock } from "react-icons/gi";
import { GoEye } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../components/store/user-slice";
import { db } from "../../firebase.config";

function ChangeLoginInfo() {
  const auth = getAuth();

  const currentPasswordInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();

  const dispatch = useDispatch();

  const showPassword = useSelector((state) => state.user.showPassword);

  const handleShow = () => {
    dispatch(userActions.show());
    passwordInputRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "users", auth.currentUser.uid);

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
        passwordConfirmInputRef.current.value !== passwordInputRef.current.value
      ) {
        throw new Error("New passwords do not match. Pls revalidate");
      }

      await updatePassword(
        auth.currentUser,
        passwordConfirmInputRef.current.value
      );
      alert("password successfully updated");
      console.log("password successfully updated");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
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

        <button className="px-4 py-2 bg-purple-600 rounded-3xl text-3xl hover:bg-purple-700 w-full">
          Save
        </button>
      </form>
    </div>
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
