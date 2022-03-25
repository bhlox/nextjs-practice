import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import React from "react";
import RecentPostsPart from "../../../components/RecentPostsPart";
import { categories } from "../../../components/Tiptap";
import { db } from "../../../firebase.config";

function BlogsCategory({ postsData, category }) {
  // console.log(postsData);
  return (
    <>
      <Head>
        <title>{category} blogs</title>
        <link rel="icon" href="/readdis_favicon.ico" />
      </Head>

      <div className="flex justify-center">
        <h2 className="text-3xl font-semibold capitalize">{category} blogs</h2>
      </div>

      {!postsData.length && (
        <div className="flex justify-center">
          <h2 className="text-4xl font-bold">Be the first to post about it!</h2>
        </div>
      )}

      {postsData && <RecentPostsPart recentPosts={postsData} />}
    </>
  );
}

export default BlogsCategory;

export async function getStaticPaths() {
  return {
    fallback: "blocking",
    paths: categories.map((category) => ({ params: { category } })),
  };
}

export async function getStaticProps(context) {
  const category = context.params.category;
  const colRef = collection(db, "posts");
  try {
    const categoryQuery = query(
      colRef,
      where("category", "==", category),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const posts = await getDocs(categoryQuery);
    const postsData = [];
    posts.docs.forEach((doc) =>
      postsData.push({
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toDateString(),
        id: doc.id,
      })
    );
    return { props: { postsData, category } };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
}
