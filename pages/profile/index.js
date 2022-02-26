import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase.config";
import { useSelector } from "react-redux";

function Profile(props) {
  const auth = getAuth();
  const checkingStatus = useSelector((state) => state.user.checkingStatus);

  // console.log("profile username is", auth.currentUser);

  console.log(checkingStatus);

  return (
    <>
      {checkingStatus && <h2>Loading...</h2>}
      {!checkingStatus && <div>Profile: {auth.currentUser.displayName}</div>}
    </>
  );
}

export default Profile;

export function getServerSideProps() {
  return {
    props: {
      username: "cock",
    },
  };
}
