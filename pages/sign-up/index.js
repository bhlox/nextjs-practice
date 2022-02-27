import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";

import nookies from "nookies";

function SignUp() {
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const auth = getAuth();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: formData.userName,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      console.log(formDataCopy);

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      console.log("registration success");
      dispatch(userActions.success());
      router.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const handleData = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.id]: e.target.value };
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h2>Registration form</h2>
      <form className="space-y-4 mt-8" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full name</label>
          <input
            className="text-black"
            type="text"
            id="name"
            onChange={handleData}
          />
        </div>
        <div>
          <label htmlFor="username">enter username</label>
          <input
            className="text-black"
            type="text"
            id="userName"
            onChange={handleData}
          />
        </div>
        <div>
          <label htmlFor="email">enter email</label>
          <input
            className="text-black"
            type="email"
            id="email"
            onChange={handleData}
          />
        </div>
        <div>
          <label htmlFor="password">enter password</label>
          <input
            className="text-black"
            type="password"
            id="password"
            onChange={handleData}
          />
        </div>
        <div className="flex justify-center">
          <button>register</button>
        </div>
      </form>
    </div>
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
