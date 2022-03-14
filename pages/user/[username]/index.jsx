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
import PlaceCard from "../../../components/PlaceCard";
import ProfilePosts from "../../../components/ProfilePosts";
import Head from "next/head";

function OtherUserProfile({ user }) {
  // DATA IS THE OTHERS USERS DATA
  console.log(user);

  // const fixedPosts = user.data.posts.map((post) => ({
  //   ...post,
  //   timestamp: post.timestamp.toDate().toDateString(),
  // }));

  // const { id, name, postsId } = data;
  const [postsId, setPostsId] = useState(user.data.posts);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const allPosts = [];
    postsId.forEach(async (id, i) => {
      const docRef = doc(db, "posts", id);
      const docData = await getDoc(docRef);
      allPosts.push({ ...docData.data(), id: docData.id });
      if (i >= postsId.length - 1) {
        setUserPosts(() => {
          const sorted = allPosts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => ({
              ...post,
              timestamp: post.timestamp.toDate().toDateString(),
            }));
          return sorted;
        });
      }
    });
  }, []);

  console.log(userPosts);

  return (
    <>
      <Head>
        <title>{user.data.username}&apos;s profile</title>
        <link rel="icon" href="/newreadit.png" />
      </Head>

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
      <ProfilePosts
        self={false}
        currentUsername={user.data.username}
        userPosts={userPosts}
      />
      {/* <div className="flex flex-wrap">
        {userPosts.map((post) => (
          <PlaceCard key={post.id} self={false} {...post} />
        ))}
      </div> */}
    </>
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
