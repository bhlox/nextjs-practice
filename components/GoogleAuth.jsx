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
        });
      }
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center bg-gray-200 text-black px-4 py-2 text-4xl rounded-3xl gap-4 border-2 hover:text-gray-300 hover:bg-transparent transition-all"
      >
        Sign {sign} with <FcGoogle />
      </button>
    </div>
  );
}

export default GoogleAuth;
