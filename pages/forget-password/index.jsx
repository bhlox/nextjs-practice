import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Head from "next/head";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { MdEmail } from "react-icons/md";
import { TiWarning } from "react-icons/ti";
import { HiCheckCircle } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { textActions } from "../../components/store/text-slice";

function ForgetPassword() {
  const auth = getAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const emailInputRef = useRef();

  const { message } = useSelector((state) => state.text);

  useEffect(() => {
    return () => dispatch(textActions.reset());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, emailInputRef.current.value);
      // alert("Link sent. pls check your email");
      dispatch(textActions.submitErrorMsg(""));
      dispatch(textActions.submitSuccessMsg("Email link sent!"));
      // router.push("/");
    } catch (error) {
      const errorMsg = error
        .toString()
        ?.split(" ")
        ?.slice(-1)
        ?.toString()
        ?.replace(/[^a-zA-Z ]/g, " ");
      dispatch(textActions.submitErrorMsg(errorMsg));
      console.log(error);
      // alert(error);
    }
  };
  return (
    <>
      <Head>
        <title>Forgot password</title>
        <meta name="description" content="forgot password" />
        <link rel="icon" href="/newreadit.png" />
      </Head>

      <div className="flex flex-col items-center">
        <h2 className="text-4xl">Enter your email address</h2>
        <form
          className="mt-8 flex flex-col space-y-16 items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative max-w-max">
            <input
              ref={emailInputRef}
              className="styled-input"
              type="email"
              id="email"
              placeholder="enter email"
              // onChange={handleData}
            />
            <MdEmail className="input-icon" />
            <h2 className="text-lg mt-2 flex">
              Remeber your password?
              <Link passHref href="/sign-in">
                <span className="hover:underline hover:text-blue-400 mx-2 cursor-pointer flex items-center gap-1">
                  <FaArrowLeft /> Back to signin
                </span>
              </Link>
            </h2>
          </div>
          {message.success && (
            <div className="flex items-center text-4xl space-x-1 bg-blue-600 p-2 rounded-xl">
              <HiCheckCircle className="text-green-400" />
              <h2 className=" font-bold capitalize">{message.success}</h2>
            </div>
          )}

          {message.error && (
            <div className="flex items-center text-4xl space-x-1 bg-red-600 p-2 rounded-xl">
              <TiWarning className="text-yellow-400" />
              <h2 className=" font-bold capitalize">{message.error}</h2>
            </div>
          )}
          <button
            disabled={message.success}
            onClick={handleSubmit}
            className={`px-4 py-2 ${
              message.success
                ? "bg-transparent"
                : "bg-purple-600 hover:bg-purple-700"
            }  rounded-3xl text-3xl  w-full`}
          >
            {message.success ? "Check email" : "Send reset link"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ForgetPassword;
