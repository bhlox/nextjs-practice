import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiLightBulb } from "react-icons/hi";
import Link from "next/link";
import lazySizes from "lazysizes";

function CarouselSlider({ posts }) {
  // const [width, setWidth] = useState(0);
  const carouselWidth = useRef();
  const imageRef = useRef(0);

  // console.log(posts);

  const [animateValue, setAnimateValue] = useState(0);
  const [show, setShow] = useState(1);
  const [windowWidth, setWindowWidth] = useState(Number);

  const [count, setCount] = useState(Number);
  const [maxCount, setMaxCount] = useState(Number);

  function reportWindowSize() {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", reportWindowSize);

    // setWidth(
    //   carouselWidth.current.scrollWidth - carouselWidth.current.offsetWidth
    // );

    if (!windowWidth) {
      setWindowWidth(window.innerWidth);
    }

    setShow(() => {
      if (windowWidth < 641) {
        return 1;
      }
      if (windowWidth < 1025) {
        return 2;
      }
      if (windowWidth > 1024) {
        return 3;
      }
    });

    setMaxCount(() => {
      if (windowWidth < 641) {
        return 11;
      }
      if (windowWidth < 1025) {
        return 5;
      }
      if (windowWidth > 1024) {
        return 3;
      }
    });

    setAnimateValue(() => {
      if (windowWidth < 641 || windowWidth < 1025 || windowWidth > 1024)
        return 0;
    });

    setCount(() => {
      if (windowWidth < 641 || windowWidth < 1025 || windowWidth > 1024)
        return 0;
    });

    return () => {
      window.removeEventListener("resize", reportWindowSize);
    };
  }, [windowWidth]);

  const handleSlide = (action) => {
    if (action === "left") {
      setAnimateValue((prev) => prev + (imageRef.current.width + 8) * show);
      setCount((prev) => prev - 1);
    } else {
      setAnimateValue((prev) => prev - (imageRef.current.width + 8) * show);
      setCount((prev) => prev + 1);
    }
  };

  return (
    <>
      <div
        ref={carouselWidth}
        className="relative p-4 overflow-hidden font-handLee"
      >
        <div className="text-4xl my-4 font-bold flex items-center gap-x-2">
          <HiLightBulb className="text-yellow-200" />
          <h2>Discover</h2>
        </div>
        <motion.div animate={{ x: animateValue }} className="flex gap-x-2 ">
          {posts.map((post, i) => (
            <div
              key={Math.random() * 232}
              className="relative shrink-0 w-full sm:w-1/2 lg:w-1/3 overflow-hidden rounded-xl text-gray-200 shadow-lg"
            >
              <Link passHref href={`/post/${post.id}`}>
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    ref={imageRef}
                    data-src={post.image}
                    alt=""
                    className="w-full object-cover h-[18rem] md:h-80 rounded-2xl cursor-pointer hover:scale-110 transition-all lazyload shadow-2xl"
                  />
                }
              </Link>
              <div className="absolute bottom-0 bg-gradient-to-t from-slate-900 dark:from-slate-600 pl-2 pt-10 w-full space-y-1">
                <Link passHref href={`/blogs/${post.category}`}>
                  <div className="uppercase font-semibold p-1 bg-slate-500 rounded cursor-pointer hover:scale-110 transition-all inline-block hover:bg-transparent font-handLee text-sm">
                    <h2>{post.category}</h2>
                  </div>
                </Link>
                <Link passHref href={`/post/${post.id}`}>
                  <h2 className="font-bold text-2xl cursor-pointer hover:underline">
                    {post.title}
                  </h2>
                </Link>

                <div className="flex items-center space-x-6 text-gray-300 opacity-90 font-extralight">
                  <Link passHref href={`/user/${post.author.username}`}>
                    <p className="hover:underline cursor-pointer font-semibold text-lg">
                      {post.author.username}
                    </p>
                  </Link>

                  <p className="font-sans">{post.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <button
          className={`arrow-btns ${
            !count && "hidden"
          } absolute top-[24%] sm:top-[20%] left-1`}
          disabled={!count}
          onClick={() => handleSlide("left")}
        >
          <FaArrowLeft />
        </button>
        <button
          className={`arrow-btns ${
            maxCount === count && "hidden"
          } absolute top-[24%] sm:top-[20%] right-1`}
          disabled={maxCount === count}
          onClick={() => handleSlide("right")}
        >
          <FaArrowRight />
        </button>
      </div>
    </>
  );
}

export default CarouselSlider;
