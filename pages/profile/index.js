import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase.config";
import { useSelector } from "react-redux";
import { useAuthContext } from "../../components/context/auth-context";
import nookies from "nookies";
import { firebaseAdmin } from "../../firebaseAdmin";
import { doc, getDoc, query, where } from "firebase/firestore";
// import * as firebaseAdmin from "firebase-admin";
// import { getAuth } from "firebase-admin";

function Profile(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    props.postsId.forEach(async (id) => {
      const docRef = doc(db, "posts", id);

      const docData = await getDoc(docRef);
      // console.log({ ...docData.data() });
      setPosts((prev) => [...prev, { ...docData.data(), id: docData.id }]);
    });
  }, []);

  return (
    <>
      <div>Profile:hello {props.username}</div>
      <h2>your email is: {props.email}</h2>
      {posts.map((post) => (
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

    // postsId.forEach(async (id) => {
    //   const docRef = doc(db, "posts", id);

    //   const docData = await getDoc(docRef);

    //   userPosts.push({ ...docData.data(), id: docData.id });
    // });

    // console.log("cockers");

    return {
      props: {
        username: name,
        email,
        postsId,
      },
    };
  } catch (error) {
    context.res.writeHead(302, { Location: "/sign-in" });
    context.res.end();

    return { props: {} };
  }
}

// REFERENCE TO HOW I SOLVE SERVER AUTH https://colinhacks.com/essays/nextjs-firebase-authentication
