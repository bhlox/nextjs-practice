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

function OtherUserProfile({ data }) {
  // console.log(data);
  // DATA IS THE OTHERS USERS DATA
  console.log(data);
  const { id, name, postsId } = data;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = [];
    postsId.forEach(async (id, i) => {
      const docRef = doc(db, "posts", id);

      const docData = await getDoc(docRef);

      allPosts.push({ ...docData.data(), id: docData.id });

      if (i >= postsId.length - 1) {
        setPosts(() => {
          const sorted = allPosts.sort((a, b) => b.timestamp - a.timestamp);
          return sorted;
        });
      }
    });
  }, []);

  return (
    <div>
      This is the profile of {name} with a id of : {id}
      <h2>their posts below</h2>
      {posts.map((post) => (
        <div key={Math.random() * 23232}>
          <img src={post.image} alt="" />
        </div>
      ))}
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
    const data = {};
    querySnapshot.forEach((doc) => {
      data.id = doc.id;
      data.name = doc.data().username;
      data.postsId = doc.data().posts;
    });

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      props: {
        username: "q",
      },
    };
  }
}
