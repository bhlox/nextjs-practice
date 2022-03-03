import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Carousel from "react-elastic-carousel";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

function CarouselSlider({ posts }) {
  // const [width, setWidth] = useState(0);
  const carouselWidth = useRef();
  const imageRef = useRef(0);

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
        return 8;
      }
      if (windowWidth < 1025) {
        return 4;
      }
      if (windowWidth > 1024) {
        return 2;
      }
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
      <div ref={carouselWidth} className="relative p-4 overflow-hidden">
        <h2 className="text-3xl my-4 font-semibold">Read more blogs</h2>
        <motion.div animate={{ x: animateValue }} className="flex gap-x-2">
          {posts.map((post, i) => (
            <div
              key={Math.random() * 232}
              className="relative shrink-0 w-full sm:w-1/2 lg:w-1/3 overflow-hidden"
            >
              <Link passHref href={`post/${post.id}`}>
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    ref={imageRef}
                    src={post.image}
                    alt=""
                    className="w-full object-cover h-40 md:h-80 rounded-2xl cursor-pointer hover:scale-110 transition-all"
                  />
                }
              </Link>
              <div className="md:absolute md:bottom-0 md:bg-gradient-to-t md:from-slate-900 md:pl-2 md:pt-10 w-full ">
                <h2 className="uppercase font-semibold">category</h2>
                <Link passHref href={`post/${post.id}`}>
                  <h2 className="font-bold cursor-pointer hover:underline">
                    {post.title}
                  </h2>
                </Link>

                <div className="flex space-x-6 text-gray-300 opacity-90 font-extralight">
                  <Link passHref href={`user/${post.username}`}>
                    <p className="hover:underline cursor-pointer font-medium">
                      {post.username}
                    </p>
                  </Link>

                  <p>{post.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        <div className="absolute w-full top-[50%] left-0 flex justify-between">
          <button
            className={`arrow-btns ${!count && "  opacity-0"}`}
            disabled={!count}
            onClick={() => handleSlide("left")}
          >
            <FaArrowLeft />
          </button>
          <button
            className={`arrow-btns ${maxCount === count && "  opacity-0"}`}
            disabled={maxCount === count}
            onClick={() => handleSlide("right")}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

export default CarouselSlider;
