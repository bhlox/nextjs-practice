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

function OtherUserProfile({ data }) {
  const { id, name, postsId } = data;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    postsId.forEach(async (id) => {
      const docRef = doc(db, "posts", id);

      const docData = await getDoc(docRef);
      // console.log({ ...docData.data() });

      setPosts((prev) => {
        const sorted = [...prev, { ...docData.data(), id: docData.id }].sort(
          (a, b) => b.timestamp - a.timestamp
        );

        return sorted;
      });
    });
  }, []);

  return (
    <div>
      This is the profile of {name} with a id of : {id}
      <h2>their posts below</h2>
      {posts.map((post) => (
        <div key={post.id}>
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
  const q = query(colRef, where("userName", "==", username));

  try {
    const querySnapshot = await getDocs(q);
    const data = {};
    querySnapshot.forEach((doc) => {
      data.id = doc.id;
      data.name = doc.data().userName;
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
