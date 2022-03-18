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

const pattern = /..+@.+\...+/;

function SignUp() {
  const showPassword = useSelector((state) => state.user.showPassword);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
  });

  const [isNameValid, setIsNameValid] = useState(false);

  const [usernameLength, setusernameLength] = useState(false);
  const [formValidity, setFormValidity] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const [isEmailValid, setisEmailValid] = useState(false);
  const [emailExists, setemailExists] = useState(false);

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const router = useRouter();

  const passwordInputRef = useRef();

  const auth = getAuth();
  const dispatch = useDispatch();

  const usersRef = collection(db, "users");

  useEffect(() => {
    dispatch(userActions.hide());
  }, [dispatch]);

  const handleData = async (e) => {
    if (e.target.id === "name") {
      setFormData((prevData) => {
        return { ...prevData, [e.target.id]: e.target.value };
      });

      setIsNameValid(e.target.value.length > 2);
    }

    if (e.target.id === "username") {
      setFormData((prevData) => {
        return { ...prevData, [e.target.id]: e.target.value };
      });
      if (e.target.value.length > 5) {
        setusernameLength(true);
      } else {
        setusernameLength(false);
      }
      const userQuery = query(
        usersRef,
        where("username", "==", e.target.value.trim())
      );
      const snapshot = await getDocs(userQuery);
      const taken = snapshot.docs.length !== 0;

      if (taken) {
        setUsernameExists(true);
      } else {
        setUsernameExists(false);
      }
    }

    if (e.target.id === "email") {
      setFormData((prevData) => {
        return { ...prevData, [e.target.id]: e.target.value };
      });
      if (e.target.value.match(pattern)) {
        setisEmailValid(true);
        const userQuery = query(
          usersRef,
          where("email", "==", e.target.value.trim())
        );
        const snapshot = await getDocs(userQuery);
        const taken = snapshot.docs.length > 0;

        if (!taken) {
          setemailExists(false);
        } else {
          setemailExists(true);
          setisEmailValid(false);
        }
      } else setisEmailValid(false);
    }

    if (e.target.id === "password") {
      setFormData((prevData) => {
        return { ...prevData, [e.target.id]: e.target.value };
      });
      if (e.target.value.length > 5 && e.target.value.match(/[0-9]/)) {
        setIsPasswordValid(true);
      } else {
        setIsPasswordValid(false);
      }
    }

    const formIsValid = Object.values(formData).every(
      (entry) => entry.length > 2
    );
    // console.log("handling data, is form valid", formIsValid);
    setFormValidity(formIsValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formIsValid = Object.values(formData).every(
    //   (entry) => entry.length > 2
    // );

    // console.log(formIsValid);

    if (!formIsValid) {
      console.log("form not valid");
      setFormValidity(false);
    }

    try {
      // const userCredential = await createUserWithEmailAndPassword(
      //   auth,
      //   formData.email,
      //   formData.password
      // );
      // const user = userCredential.user;
      // console.log(formData);
      // await updateProfile(auth.currentUser, {
      //   displayName: formData.username,
      //   photoURL:
      //     "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433__480.png",
      // });
      // const formDataCopy = {
      //   username: formData.username,
      //   name: formData.name,
      //   email: formData.email,
      //   posts: [],
      //   profilePic:
      //     "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433__480.png",
      //   coverPic:
      //     "https://forum.gameznetwork.com/styles/brivium/ProfileCover/default.jpg",
      //   socials: {
      //     facebook: "",
      //     twitter: "",
      //     instagram: "",
      //   },
      //   aboutMe: "",
      //   timestamp: serverTimestamp(),
      // };
      // console.log(formDataCopy);
      // await setDoc(doc(db, "users", user.uid), formDataCopy);
      // console.log("registration success");
      // dispatch(userActions.success());
      // router.push("/profile");
    } catch (error) {
      console.log(error);
      alert(error);
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
              className="styled-input"
              type="text"
              id="name"
              onChange={handleData}
              placeholder="enter full name"
              autoComplete="none"
            />
            <GoPerson className="input-icon" />
            {formData.name && isNameValid && (
              <HiCheckCircle className="text-green-400 text-3xl absolute top-1/2 -translate-y-1/2 right-0" />
            )}
            {formData.name && !isNameValid && (
              <div>
                <p className="text-xl font-light">Minimum of 3 characters</p>
              </div>
            )}
          </div>

          <div className="relative max-w-max">
            <input
              className={`styled-input ${
                usernameExists ? "border-red-400 border-b-4" : ""
              }`}
              type="text"
              id="username"
              onChange={handleData}
              placeholder="enter username"
              autoComplete="none"
              maxLength={20}
            />
            <VscOctoface className="input-icon" />
            {formData.username && !usernameExists && usernameLength && (
              <HiCheckCircle className="text-green-400 text-3xl absolute top-1/2 -translate-y-1/2 right-0" />
            )}
            {formData.username && !usernameLength && (
              <div>
                <p className="text-xl font-light">Minimum of 6 characters</p>
              </div>
            )}
            {formData.username &&
              usernameExists &&
              formData.username.length > 5 && (
                <div className="flex gap-x-1 items-center text-2xl font-bold">
                  <TiWarning className="text-yellow-400" />
                  <p>username is taken</p>
                </div>
              )}
          </div>

          <div className="relative max-w-max">
            <input
              className="styled-input"
              type="email"
              id="email"
              onChange={handleData}
              placeholder="enter email"
              autoComplete="none"
            />
            <MdEmail className="input-icon" />
            {formData.email && emailExists && <div>email already exists</div>}
            {formData.email && !isEmailValid && <div>email invalid</div>}
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
            {formData.password && !isPasswordValid && (
              <div>your password is weak</div>
            )}
          </div>
          <GoogleAuth sign="up" />
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!formValidity}
            className={`px-4 py-2 ${
              formValidity
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-transparent"
            }  rounded-3xl text-3xl  w-full outline-2 outline-purple-500 outline`}
          >
            {formValidity ? "Submit registration" : "Pls check your entries"}
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
