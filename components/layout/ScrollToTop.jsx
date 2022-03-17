import React, { useEffect, useState } from "react";
import { BiArrowToTop } from "react-icons/bi";

function ScrollToTop() {
  const [showBtn, setShowBtn] = useState(false);

  const toggleVisibility = () => {
    if (
      document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150
    ) {
      setShowBtn(true);
    } else setShowBtn(false);
  };

  const handleScroll = () => {
    document.documentElement.scrollTop = 0;
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {showBtn && (
        <button
          className="cursor-pointer hover:opacity-80 fixed bottom-7 right-7 md:bottom-14 md:right-14 rounded-full p-2 bg-gray-400 text-3xl"
          onClick={handleScroll}
        >
          <BiArrowToTop />
        </button>
      )}
    </>
  );
}

export default ScrollToTop;
