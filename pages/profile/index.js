import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase.config";
import { useSelector } from "react-redux";
import { useAuthContext } from "../../components/context/auth-context";
import nookies from "nookies";
import { firebaseAdmin } from "../../firebaseAdmin";
// import * as firebaseAdmin from "firebase-admin";
// import { getAuth } from "firebase-admin";

function Profile(props) {
  return (
    <>
      <div>Profile:hello {props.username}</div>
      <h2>your email is: {props.email}</h2>
      {/* {checkingStatus && <h2>Loading...</h2>}
      {!checkingStatus && <div>Profile: {auth.currentUser.displayName}</div>} */}
    </>
  );
}

export default Profile;

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);

  try {
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid, email, name } = token;

    // DO FETCHING HERE

    return {
      props: {
        username: name,
        email,
      },
    };
  } catch (error) {
    context.res.writeHead(302, { Location: "/sign-in" });
    context.res.end();

    return { props: {} };
  }
}

// REFERENCE TO HOW I SOLVE SERVER AUTH https://colinhacks.com/essays/nextjs-firebase-authentication
