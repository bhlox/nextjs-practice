import Head from "next/head";
import Link from "next/link";
import PlaceCard from "../components/PlaceCard";

const DUMMY = [
  {
    id: "234jikjdf8",
    title: "fantastic",
    photo:
      "https://cdn.pixabay.com/photo/2021/10/04/06/28/cactus-6679665__340.jpg",
    user: "cock",
    description: "sweden",
  },
  {
    id: "e0f90934",
    title: "yep",
    photo:
      "https://cdn.pixabay.com/photo/2022/02/17/07/51/church-7018154__340.jpg",
    user: "cock",
    description: "sweden",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>TRAVEL VLOGS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center">
        <h2 className="text-3xl font-bold">Travel Vlogs</h2>
      </div>

      <div className="flex flex-wrap">
        {/* SINGLE CARD MAP HERE */}
        {DUMMY.map((item) => (
          <PlaceCard key={item.id} {...item} />
        ))}
        {/* END SINGLE CARD */}
      </div>
    </>
  );
}
