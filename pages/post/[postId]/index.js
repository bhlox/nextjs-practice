import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import { db } from "../../../firebase.config";

function postId({ id, data }) {
  console.log(data);
  const { title, image, place, username, useruid } = data;
  return (
    <div className="flex flex-col items-center justify-center">
      <h2>{title}</h2>
      <Link href={`/${username}`}>{username}</Link>
      <img src={image} alt={title} />
    </div>
  );
}

export default postId;

export async function getServerSideProps(context) {
  const id = context.params.postId;
  const docRef = doc(db, "posts", id);
  console.log(docRef);
  try {
    const docData = await getDoc(docRef);
    return { props: { data: docData.data(), id: docData.id } };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
