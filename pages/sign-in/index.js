import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";

import nookies from "nookies";

function SignIn() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = getAuth();

  const handleData = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.id]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      dispatch(userActions.success());
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2>Sign in here</h2>
      <form className="mt-8" onSubmit={handleSubmit}>
        <label htmlFor="email">enter email</label>
        <input
          className="text-black"
          type="email"
          id="email"
          onChange={handleData}
        />
        <label htmlFor="password">enter password</label>
        <input
          className="text-black"
          type="password"
          id="password"
          onChange={handleData}
        />
        <button>sign-in</button>
      </form>
    </div>
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
