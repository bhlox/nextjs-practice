import React from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase.config";

function Profile(props) {
  console.log(props);
  return <div>Profile</div>;
}

export default Profile;

export function getServerSideProps() {
  return {
    props: {
      username: "",
    },
    revalidate: 1,
  };
}
