import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import Head from "next/head";

function SearchPosts({ titleQuery, matchedPosts }) {
  const router = useRouter();

  console.log(matchedPosts);

  // const matchedPosts = [];
  // matchedPostsId.forEach(async (id) => {
  //   const docRef = doc(db, "posts", id);
  //   const post = await getDoc(docRef);
  //   matchedPosts.push({ ...post.data(), id: post.id });
  //   console.log(matchedPosts);
  // });

  // titles.forEach((title) => {
  //   titleQuery.split(" ").forEach((query) => {
  //     if (title.title.split(" ").includes(query)) {
  //       console.log("search has matching data");
  //       console.log(
  //         `this is the query: ${query} ... and this is the title: ${title.title} with the post id: ${title.id}`
  //       );
  //     }
  //   });
  // });

  return (
    <>
      <Head>
        <title>Search: {titleQuery} - Readis</title>
        <link rel="icon" href="/newreadit.png" />
      </Head>
    </>
  );
}

export default SearchPosts;

export async function getServerSideProps(context) {
  context.res.setHeader("Cache-control", "s-maxage=20, stale-while-revalidate");

  const titleQuery = context.query.title.toLowerCase();
  const colRef = collection(db, "posts");

  try {
    const posts = await getDocs(colRef);
    const titles = [];
    posts.docs.forEach((doc) =>
      titles.push({
        title: doc
          .data()
          .title.split(" ")
          .map((word) => word.toLowerCase())
          .join(" "),
        id: doc.id,
      })
    );

    const matchedPostsId = [];
    titles.forEach((title) => {
      titleQuery.split(" ").forEach((query) => {
        if (title.title.split(" ").includes(query)) {
          matchedPostsId.push(title.id);
        }
      });
    });

    const matchedPosts = [];
    for (const postId of matchedPostsId) {
      const docRef = doc(db, "posts", postId);
      const post = await getDoc(docRef);
      matchedPosts.push({
        ...post.data(),
        timestamp: post.data().timestamp.toDate().toDateString(),
        id: post.id,
      });
    }

    return { props: { titleQuery, matchedPosts } };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
}

// QUERY PARAMS CLIENT SIDE : https://stackoverflow.com/questions/66133814/how-to-get-url-query-string-on-next-js-static-site-generation

// QUERY PARAMS  SERVER SIDE: https://www.youtube.com/watch?v=Hb3Mo4kaI7E

// ASYNC IN FOR EACH ON SERVER SIDE SOLUTION: https://stackoverflow.com/questions/70158918/async-await-not-working-as-i-expected-in-foreach-loop
