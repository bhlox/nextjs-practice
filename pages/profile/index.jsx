import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase.config";
import { useSelector } from "react-redux";
import { useAuthContext } from "../../components/context/auth-context";
import nookies from "nookies";
import { firebaseAdmin } from "../../firebaseAdmin";
import { doc, getDoc, query, where } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

function Profile({ userData }) {
  console.log(userData);

  const {
    posts: postsId,
    username,
    email,
    uid,
    profilePic,
    coverPic,
  } = userData;

  const auth = getAuth();
  console.log(auth.currentUser);

  const userRef = doc(db, "users", uid);

  const [userPosts, setPosts] = useState([]);
  const [previewProf, setPreviewProf] = useState(profilePic);
  const [previewCover, setPreviewCover] = useState(coverPic);

  const storage = getStorage();

  const handleProfPic = (e) => {
    const file = e.target.files[0];

    if (e.target.id === "profPic") {
      if (file.size > 2227138) {
        alert("file is too big, pls upload 2mb or less only");
      }

      const uploadImgRef = ref(storage, `profile-picture/${file.name}`);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const uploadTask = await uploadString(
            uploadImgRef,
            reader.result,
            "data_url"
          );
          const url = getDownloadURL(uploadTask.ref);
          const downloadUrl = await url;

          setPreviewProf(reader.result);
          // dispatch(
          //   imageActions.setPreview({
          //     name: file.name,
          //     data_url: reader.result,
          //   })
          // );
          // console.log(reader.result);

          await updateDoc(userRef, { profilePic: downloadUrl });
        };
        reader.readAsDataURL(file);
      }
    }
    if (e.target.id === "coverPic") {
      if (file.size > 10227138) {
        alert("file is too big, pls upload 10mb or less only");
      }

      const uploadImgRef = ref(storage, `profile-cover/${file.name}`);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const uploadTask = await uploadString(
            uploadImgRef,
            reader.result,
            "data_url"
          );
          const url = getDownloadURL(uploadTask.ref);
          const downloadUrl = await url;

          setPreviewCover(reader.result);

          await updateDoc(userRef, { coverPic: downloadUrl });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    const allPosts = [];
    postsId.forEach(async (id, i) => {
      const docRef = doc(db, "posts", id);

      const docData = await getDoc(docRef);
      allPosts.push({ ...docData.data(), id: docData.id });

      if (i === postsId.length - 1) {
        setPosts(() => {
          const sorted = allPosts.sort((a, b) => b.timestamp - a.timestamp);
          return sorted;
        });
      }
    });
  }, []);

  return (
    <>
      <div>Profile:hello {username}</div>
      <h2>your email is: {email}</h2>

      <div>
        <h2>this is profile pic</h2>
        <input
          type="file"
          name="profPic"
          id="profPic"
          accept=".jpg, .jpeg, .png"
          onChange={handleProfPic}
        />
        <img
          className="h-48 w-48 rounded-full object-cover object-center"
          src={previewProf}
          alt=""
        />
        <h2>this is cover pic</h2>
        <input
          type="file"
          name="coverPic"
          id="coverPic"
          accept=".jpg, .jpeg, .png"
          onChange={handleProfPic}
        />
        <img
          className=" w-[640px] h-[360px] md:w-[820px] md:h-[312px] object-cover object-center rounded-t-xl"
          src={previewCover}
          alt=""
        />
      </div>
      {userPosts.map((post) => (
        <div key={Math.random()}>
          <h2>{post.title}</h2>
          <img src={post.image} alt="" />
        </div>
      ))}
    </>
  );
}

export default Profile;

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);

  try {
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const userRef = doc(db, "users", uid);
    const userData = await getDoc(userRef);

    const name = userData.data().userName;

    // DO FETCHING HERE

    const postsId = userData.data().posts;

    const data = {
      ...userData.data(),
      timestamp: userData.data().timestamp.toDate().toDateString(),
    };

    // postsId.forEach(async (id) => {
    //   const docRef = doc(db, "posts", id);

    //   const docData = await getDoc(docRef);

    //   userPosts.push({ ...docData.data(), id: docData.id });
    // });

    // console.log("cockers");

    return {
      props: {
        userData: { ...data, uid },
      },
    };
  } catch (error) {
    context.res.writeHead(302, { Location: "/sign-in" });
    context.res.end();

    return { props: {} };
  }
}

// REFERENCE TO HOW I SOLVE SERVER AUTH https://colinhacks.com/essays/nextjs-firebase-authentication
