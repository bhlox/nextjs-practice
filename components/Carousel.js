import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Carousel from "react-elastic-carousel";

function CarouselSlider({ posts }) {
  const [width, setWidth] = useState(0);
  const carouselWidth = useRef();
  const imageRef = useRef(0);

  const [animateValue, setAnimateValue] = useState(0);

  useEffect(() => {
    setWidth(
      carouselWidth.current.scrollWidth - carouselWidth.current.offsetWidth
    );
  }, []);

  const handleSlide = (action) => {
    console.log(imageRef.current.width);
    if (action === "inc") {
      setAnimateValue((prev) => prev + imageRef.current.width);
    } else {
      setAnimateValue((prev) => prev - imageRef.current.width);
    }
  };

  return (
    <div ref={carouselWidth} className="p-4 overflow-hidden">
      <motion.div animate={{ x: animateValue }} className="flex">
        {posts.map((post) => (
          <motion.div
            key={Math.random() * 232}
            className="relative shrink-0 w-full sm:w-1/2 lg:w-1/3 p-2"
          >
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imageRef}
                src={post.image}
                alt=""
                className="w-full object-cover h-40 md:h-80 "
              />
            }
            <div className="">
              <h2 className="font-bold">{post.title}</h2>
              <p>{post.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <button onClick={() => handleSlide("inc")}>left</button>
      <button onClick={() => handleSlide("dec")}>right</button>
    </div>
  );
}

export default CarouselSlider;
