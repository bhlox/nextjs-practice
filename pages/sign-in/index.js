import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";
import { GiDialPadlock } from "react-icons/gi";
import { GoEye } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import nookies from "nookies";
import GoogleAuth from "../../components/GoogleAuth";
import { useSelector } from "react-redux";

function SignIn() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = getAuth();

  const showPassword = useSelector((state) => state.user.showPassword);

  useEffect(() => {
    dispatch(userActions.hide());
  }, [dispatch]);

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

  const handleShow = () => {
    dispatch(userActions.show());
  };

  return (
    <div className="flex flex-col items-center">
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
        </div>
        <GoogleAuth sign="in" />
        <button className="px-4 py-2 bg-purple-600 rounded-3xl text-3xl hover:bg-purple-700 w-full">
          Sign-in
        </button>
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
