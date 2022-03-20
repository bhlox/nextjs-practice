import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";
import { GiDialPadlock } from "react-icons/gi";
import { GoEye } from "react-icons/go";
import { TiWarning } from "react-icons/ti";
import { MdEmail } from "react-icons/md";
import nookies from "nookies";
import GoogleAuth from "../../components/GoogleAuth";
import { useSelector } from "react-redux";
import Link from "next/link";
import { textActions } from "../../components/store/text-slice";
import { uiActions } from "../../components/store/ui-slice";

function SignIn() {
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();
  const auth = getAuth();

  const passwordInputRef = useRef();

  const showPassword = useSelector((state) => state.user.showPassword);
  const { message } = useSelector((state) => state.text);
  const { load } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(userActions.hide());

    return () => dispatch(textActions.reset());
  }, [dispatch]);

  const handleData = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.id]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(uiActions.loading());

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      dispatch(userActions.success());
      dispatch(uiActions.loaded());
      router.push("/");
    } catch (error) {
      const errorMsg = error
        .toString()
        ?.split(" ")
        ?.slice(-1)
        ?.toString()
        ?.replace(/[^a-zA-Z ]/g, " ");
      dispatch(textActions.submitErrorMsg(errorMsg));
      dispatch(uiActions.loaded());
      console.log(error);
    }
  };

  const handleShow = () => {
    dispatch(userActions.show());
    passwordInputRef.current.focus();
  };

  return (
    <>
      <Head>
        <title>Sign in</title>
        <link rel="icon" href="/newreadit.png" />
      </Head>

      <div className="flex flex-col items-center font-sans">
        <h2 className="text-4xl">Sign in here</h2>
        <form
          className="mt-8 flex flex-col space-y-16 items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative max-w-max">
            <input
              className="styled-input"
              type="email"
              id="email"
              placeholder="enter email"
              onChange={handleData}
            />
            <MdEmail className="input-icon" />
          </div>
          <div className="relative max-w-max">
            <input
              className="styled-input"
              type={showPassword ? "text" : "password"}
              ref={passwordInputRef}
              id="password"
              placeholder="enter password"
              onChange={handleData}
            />
            <GiDialPadlock className="input-icon" />
            <GoEye
              onClick={handleShow}
              className={`absolute right-0 top-0 text-3xl md:text-5xl ${
                showPassword ? "text-red-500" : "text-purple-600"
              }  cursor-pointer hover:text-purple-400`}
            />
            <Link passHref href="/forget-password">
              <h2 className="cursor-pointer text-xl hover:underline hover:text-blue-400 mt-2">
                Forget password?
              </h2>
            </Link>
          </div>

          {!load && message.error && (
            <div className="flex items-center text-4xl space-x-1 bg-red-600 p-2 rounded-xl">
              <TiWarning className="text-yellow-400" />
              <h2 className=" font-bold capitalize">{message.error}</h2>
            </div>
          )}
          {!load && <GoogleAuth sign="in" />}
          <button
            disabled={load}
            className={`px-4 py-2 ${
              load ? "bg-transparent" : "bg-purple-600"
            }  rounded-3xl text-3xl hover:bg-purple-700 w-full`}
          >
            {!load ? "Sign-in" : "Verifying..."}
          </button>
        </form>
      </div>
    </>
  );
}

export default SignIn;

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
