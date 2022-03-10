import { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase.config";
import { getAuth } from "firebase/auth";
import ProfileCard from "../../../components/ProfileCard";

function OtherUserProfile({ user }) {
  // DATA IS THE OTHERS USERS DATA
  console.log(user);

  // const { id, name, postsId } = data;
  const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   const allPosts = [];
  //   postsId.forEach(async (id, i) => {
  //     const docRef = doc(db, "posts", id);

  //     const docData = await getDoc(docRef);

  //     allPosts.push({ ...docData.data(), id: docData.id });

  //     if (i >= postsId.length - 1) {
  //       setPosts(() => {
  //         const sorted = allPosts.sort((a, b) => b.timestamp - a.timestamp);
  //         return sorted;
  //       });
  //     }
  //   });
  // }, []);

  return (
    <div>
      {/* This is the profile of {name} with a id of : {id} */}
      <ProfileCard
        self={false}
        previewSocials={user.data.socials}
        currentUsername={user.data.username}
        currentName={user.data.name}
        currentAbout={user.data.aboutMe}
        previewCover={user.data.coverPic}
        previewProf={user.data.profilePic}
        timestamp={user.data.timestamp}
        email={user.data.email}
      />
      {/* {posts.map((post) => (
        <div key={Math.random() * 23232}>
          <img src={post.image} alt="" />
        </div>
      ))} */}
    </div>
  );
}

export default OtherUserProfile;

export async function getServerSideProps(context) {
  const username = context.params.username;
  const colRef = collection(db, "users");
  const q = query(colRef, where("username", "==", username));

  try {
    const querySnapshot = await getDocs(q);

    const user = {};
    querySnapshot.forEach((doc) => {
      user.id = doc.id;
      user.data = {
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toDateString(),
      };
    });

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        username: "wat",
      },
    };
  }
}
