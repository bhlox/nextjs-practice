import React, { useEffect, useRef, useState } from "react";
import { VscOctoface } from "react-icons/vsc";
import { GiDialPadlock } from "react-icons/gi";
import { GoEye, GoPerson } from "react-icons/go";
import { MdEmail } from "react-icons/md";

import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import Head from "next/head";

import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";

import nookies from "nookies";
import { useSelector } from "react-redux";
import GoogleAuth from "../../components/GoogleAuth";

function SignUp() {
  const showPassword = useSelector((state) => state.user.showPassword);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const passwordInputRef = useRef();

  const auth = getAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.hide());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log(formData);
      await updateProfile(auth.currentUser, {
        displayName: formData.username,
        photoURL:
          "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433__480.png",
      });

      const formDataCopy = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
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
      };
      // formDataCopy.posts = [];
      // formDataCopy.profilePic =
      //   "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433__480.png";
      // formDataCopy.coverPic =
      //   "https://forum.gameznetwork.com/styles/brivium/ProfileCover/default.jpg";
      // formDataCopy.socials = {
      //   facebook: "",
      //   twitter: "",
      //   instagram: "",
      // };
      // formDataCopy.aboutMe = "";
      // formDataCopy.timestamp = serverTimestamp();

      console.log(formDataCopy);

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      console.log("registration success");
      dispatch(userActions.success());
      router.push("/profile");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleData = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.id]: e.target.value };
    });
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
              className="styled-input"
              type="text"
              id="name"
              onChange={handleData}
              placeholder="enter full name"
            />
            <GoPerson className="input-icon" />
          </div>
          <div className="relative max-w-max">
            <input
              className="styled-input"
              type="text"
              id="username"
              onChange={handleData}
              placeholder="enter username"
            />
            <VscOctoface className="input-icon" />
          </div>
          <div className="relative max-w-max">
            <input
              className="styled-input"
              type="email"
              id="email"
              onChange={handleData}
              placeholder="enter email"
            />
            <MdEmail className="input-icon" />
          </div>
          <div className="relative max-w-max">
            <input
              className="styled-input"
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
          </div>
          <GoogleAuth sign="up" />
          <button className="px-4 py-2 bg-purple-600 rounded-3xl text-3xl hover:bg-purple-700 w-full">
            register
          </button>
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
