import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import { db } from "../../../firebase.config";

function postId({ id, image, title, username, timestamp }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2>{title}</h2>
      <Link href={`/user/${username}`}>{username}</Link>
      {
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} />
      }
      <h2>posted at: {timestamp}</h2>
    </div>
  );
}

export default postId;

export async function getServerSideProps(context) {
  const id = context.params.postId;
  const docRef = doc(db, "posts", id);

  try {
    const docData = await getDoc(docRef);
    return {
      props: {
        title: docData.data().title,
        image: docData.data().image,
        username: docData.data().username,
        id: docData.id,
        timestamp: docData.data().timestamp.toDate().toDateString(),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
