import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { MdEmail } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

function ForgetPassword() {
  const auth = getAuth();
  const router = useRouter();

  const emailInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, emailInputRef.current.value);
      console.log("password reset link sent");
      router.push("/");
    } catch (error) {
      console.log(error);
      //   alert(error);
    }
  };
  return (
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

        <button className="px-4 py-2 bg-purple-600 rounded-3xl text-3xl hover:bg-purple-700 w-full">
          Send reset link
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;
