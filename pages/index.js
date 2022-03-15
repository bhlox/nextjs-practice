import Head from "next/head";

import PlaceCard from "../components/PlaceCard.jsx";

import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.config";

// import Image from "next/image";
import Link from "next/link";
import CarouselSlider from "../components/Carousel.jsx";
import { useEffect, useState } from "react";
import LatestPostsPart from "../components/LatestPostsPart.jsx";
import RecentPostsPart from "../components/RecentPostsPart.jsx";

export default function Home({ posts }) {
  // console.log(posts);
  const colRef = collection(db, "posts");

  const latestPosts = posts.filter((post, i) => i <= 1);

  const [randomPosts, setRandomPosts] = useState([]);

  const recentPosts = posts.filter((post, i) => i > 1);

  const fetchRandomPosts = async () => {
    const posts = [];
    try {
      const snapshot = await getDocs(colRef);

      snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp.toDate().toDateString(),
        }))
        .sort(() => Math.random() - 0.5)
        .every((doc, i) => {
          if (i > 11) return false;
          posts.push({ ...doc });
          return true;
        });
      console.log(posts);
      setRandomPosts(posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRandomPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Readis Thoughts</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/newreadit.png" />
      </Head>

      <div className="mx-auto flex flex-col items-center justify-center space-y-6 ">
        <h2 className="text-5xl font-bold">Readis Thoughts</h2>
        <h2 className="text-6xl italic font-semibold text-orange-400">
          &quot;Blogs&quot;
        </h2>
        <p className="hidden sm:block max-w-sm text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi,
          aspernatur accusamus. Odit!
        </p>
      </div>

      {/* LATEST BLOG HERE */}

      <LatestPostsPart latestPosts={latestPosts} />

      {/* <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-1 sm:space-x-6">
        <div className="sm:w-full overflow-hidden">
          <Link passHref href={`/post/${posts[0].id}`}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posts[0].image}
                alt={posts[0].title}
                className=" h-[28rem] w-full object-cover rounded-2xl cursor-pointer hover:scale-110 transition-all"
              />
            }
          </Link>
        </div>

        <div
          className="flex flex-col justify-between
         text-gray-200"
        >
          <div className="space-y-2">
            <span className="px-2 py-1 font-medium bg-blue-200 rounded-lg text-xl text-blue-500">
              Latest
            </span>
            <Link passHref href={`/post/${posts[0].id}`}>
              <h2 className="font-bold text-4xl capitalize cursor-pointer hover:underline">
                {posts[0].title}
              </h2>
            </Link>
            <p className="hidden sm:block leading-tight capitalize font-light text-3xl">
              {posts[0].summary.substring(0, 43)}...
              <Link passHref href={`/post/${posts[0].id}`}>
                <span
                  className="cursor-pointer text-blue-400 text-2xl hover:underline"
                  onClick={null}
                >
                  read more
                </span>
              </Link>
            </p>
          </div>
          <div className="text-gray-300 opacity-90 font-extralight flex justify-between items-center">
            <h4 className="text-xl">
              Posted by:
              <Link passHref href={`/user/${posts[0].username}`}>
                <span className="hover:underline cursor-pointer px-2">
                  {posts[0].username}
                </span>
              </Link>
            </h4>
            <span>Published {posts[0].timestamp}</span>
          </div>
        </div>
      </div> */}

      {/* END LATEST BLOG HERE */}

      <CarouselSlider posts={randomPosts} />

      <RecentPostsPart recentPosts={recentPosts} headline={true} />
    </>
  );
}

export async function getStaticProps(context) {
  const colRef = collection(db, "posts");
  try {
    const q = query(colRef, orderBy("timestamp", "desc"), limit(14));

    const snapshot = await getDocs(q);

    const posts = [];
    snapshot.docs.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp.toDate().toDateString(),
      });
    });

    return {
      revalidate: 600,
      props: {
        posts,
      },
    };
  } catch (error) {
    return {
      props: {
        posts: [],
      },
    };
  }
}
