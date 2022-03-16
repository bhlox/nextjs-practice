import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import Head from "next/head";
import conjunctionsAndPreps from "../../utils/conjunctionList";
import SearchCard from "../../components/SearchCard";

function SearchPosts({ searchQuery, matchedPosts, message, postsData }) {
  const router = useRouter();

  // console.log(searchQuery);
  console.log(matchedPosts);
  // console.log(postsData);
  // console.log(`the message: ${message}`);
  // console.log(message);

  return (
    <>
      <Head>
        <title>Search: {searchQuery} - Readis</title>
        <link rel="icon" href="/newreadit.png" />
      </Head>

      <div className="flex justify-center">
        <h2 className="flex items-center font-light gap-x-3 text-3xl">
          Results for:
          <span className="text-4xl font-semibold">{searchQuery}</span>
        </h2>
      </div>

      {(message || !matchedPosts.length) && (
        <div className="flex justify-center text-center">
          <h2 className="text-4xl font-medium">
            Search could&apos;nt find a match. Try a different one
          </h2>
        </div>
      )}

      {matchedPosts && (
        <div className="space-y-6">
          {matchedPosts.map((post) => (
            <SearchCard key={post.id} {...post} searchQuery={searchQuery} />
          ))}
        </div>
      )}
    </>
  );
}

export default SearchPosts;

export async function getServerSideProps(context) {
  context.res.setHeader("Cache-control", "s-maxage=20, stale-while-revalidate");

  const searchQuery = context.query.q.trim().toLowerCase();
  const colRef = collection(db, "posts");
  let count = 0;

  const isQueryValid = searchQuery.split(" ").every((word, i) => {
    if (conjunctionsAndPreps.includes(word)) {
      count = count + 1;
    }
    if (i === searchQuery.split(" ").length - 1 && i + 1 === count) {
      console.log("all are invalid");
      return false;
    }
    return true;
  });

  try {
    if (!isQueryValid) {
      throw new Error("no cock");
    }

    const posts = await getDocs(colRef);
    const postsData = [];
    posts.docs.forEach((doc) =>
      postsData.push({
        title: doc
          .data()
          .title.split(" ")
          .map((word) => word.toLowerCase())
          .join(" "),
        summary: doc
          .data()
          .summary.split(" ")
          .map((word) => word.toLowerCase())
          .join(" "),
        id: doc.id,
      })
    );

    const matchedPostsId = [];
    postsData.forEach((data) => {
      searchQuery.split(" ").forEach((query) => {
        if (
          data.title.split(" ").includes(query) ||
          data.summary.split(" ").includes(query)
        ) {
          if (
            !conjunctionsAndPreps.includes(query) &&
            !matchedPostsId.includes(data.id)
          ) {
            matchedPostsId.push(data.id);
          }
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

    return { props: { searchQuery, matchedPosts, postsData } };
  } catch (error) {
    console.log(error);
    return { props: { searchQuery, message: "search invalid" } };
  }
}

// QUERY PARAMS CLIENT SIDE : https://stackoverflow.com/questions/66133814/how-to-get-url-query-string-on-next-js-static-site-generation

// QUERY PARAMS  SERVER SIDE: https://www.youtube.com/watch?v=Hb3Mo4kaI7E

// ASYNC IN FOR EACH ON SERVER SIDE SOLUTION: https://stackoverflow.com/questions/70158918/async-await-not-working-as-i-expected-in-foreach-loop
