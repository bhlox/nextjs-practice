import React, { useRef, useState } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";

function ContactAccordion({ title, info }) {
  const [showInfo, setShowInfo] = useState(false);

  const tab1 = useRef();

  return (
    <div className="">
      <div
        onClick={() => setShowInfo((prev) => !prev)}
        className="flex items-center justify-between border-2 p-2 cursor-pointer hover:dark:bg-slate-600 hover:bg-gray-300"
      >
        <h2 className="font-semibold text-3xl">{title}</h2>
        <span className={`transition-all ${showInfo ? "rotate-180" : ""}`}>
          <FaAngleDoubleDown className="text-2xl" />
        </span>
      </div>
      <div
        ref={tab1}
        className={`dark:bg-slate-700 bg-gray-300 h-0 overflow-hidden transition-all duration-300 ${
          showInfo ? "h-max" : ""
        }`}
      >
        <p className="p-2 text-lg font-light max-w-sm">{info}</p>
      </div>
    </div>
  );
}

export default ContactAccordion;
