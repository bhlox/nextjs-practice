import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { GiDialPadlock } from "react-icons/gi";
import { GoEye } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { userActions } from "../../../components/store/user-slice";
import { useRouter } from "next/router";
import Head from "next/head";
import { accountFormActions } from "../../../components/store/account-form-slice";

export default function GoogleSetPassword({ setPassword }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const dispatch = useDispatch();
  const router = useRouter();

  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();

  const showPassword = useSelector((state) => state.user.showPassword);

  const handleShow = () => {
    dispatch(userActions.show());
    passwordInputRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "users", auth.currentUser.uid);

    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;
    const passwordValidity =
      format.test(passwordConfirmInputRef.current.value) &&
      passwordConfirmInputRef.current.value.length > 5;

    const isSame =
      passwordConfirmInputRef.current.value === passwordInputRef.current.value;

    try {
      if (!passwordValidity) throw new Error("Password is too weak");

      if (!isSame) throw new Error("Password credentials do not match");

      await updatePassword(user, passwordConfirmInputRef.current.value);
      await updateDoc(userRef, { setPassword: deleteField() });

      // console.log("password is set");
      router.push("/profile");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    return () => dispatch(accountFormActions.reset());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Set Password</title>
        <link rel="icon" href="/newreadit.png" />
      </Head>

      {setPassword && (
        <div className="flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold">Set Password</h2>
            <h4 className="max-w-md font-light">
              You may whenever set your password next time you signin through
              Google. You will be redirected to this page again.
            </h4>
          </div>
          <form
            className="mt-8 flex flex-col space-y-16 items-center"
            onSubmit={handleSubmit}
          >
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
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const uid = context.params.userId;

  const userRef = doc(db, "users", uid);
  try {
    const userData = await getDoc(userRef);
    const setPassword = userData.data().setPassword;
    if (setPassword) {
      return { props: { setPassword } };
    }
    if (!setPassword) throw new Error(error);
  } catch (error) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
    // console.log(error);
    return { props: { setPassword: false } };
  }
}
