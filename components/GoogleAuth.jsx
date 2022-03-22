import React from "react";
import { FcGoogle } from "react-icons/fc";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useRouter } from "next/router";

function GoogleAuth({ sign }) {
  const router = useRouter();

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If user, doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
          posts: [],
          username: user.displayName,
          profilePic: user.photoURL,
          coverPic:
            "https://forum.gameznetwork.com/styles/brivium/ProfileCover/default.jpg",
          socials: {
            facebook: "",
            insagram: "",
            twitter: "",
          },
          setPassword: true,
          comments: [],
          aboutMe: "",
        });
      }
      router.push(`/google-set-password/${user.uid}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-6">
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center px-4 py-2 text-4xl rounded-xl gap-4 border-2 transition-all dark:border-stone-200 hover:scale-110 border-slate-800"
        >
          <FcGoogle /> Sign {sign} with Google
        </button>
      </div>
    </>
  );
}

export default GoogleAuth;
