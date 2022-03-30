import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaPhoneAlt,
  FaGlobe,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GoLocation } from "react-icons/go";
import Head from "next/head";

function DevCard() {
  return (
    <>
      <Head>
        <title>Contact us - Readis</title>
      </Head>

      <div className="mx-auto">
        <div className="flex flex-col md:flex-row w-96 md:w-full">
          <div className="md:h-80 lg:h-64 flex flex-col dark:bg-slate-700 bg-gray-300 p-4 rounded-b md:rounded-r md:rounded-bl-none">
            <div className="border-b-2 flex flex-col sm:flex-row sm:justify-between sm:items-center md:items-start pb-4 space-y-3 md:w-80 lg:w-96">
              <div className=" -space-y-2">
                <h2 className="text-4xl font-semibold">Kurk Villanueva</h2>
                <h4 className="text-xl font-extralight">Web Developer</h4>
              </div>
              <div className="flex space-x-2 text-3xl">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/kurk-villanueva-02779216b/"
                  className="cursor-pointer hover:scale-110 hover:-translate-y-2 transition-all"
                >
                  <FaLinkedin className="text-blue-700" />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/bhlox"
                  className="cursor-pointer hover:scale-110 hover:-translate-y-2 transition-all"
                >
                  <FaGithub />
                </a>
                {/* <h4 className="cursor-pointer hover:scale-110 hover:-translate-y-2 transition-all">
                  <FaTwitter className="text-blue-400" />
                </h4> */}
              </div>
            </div>
            <div className="flex flex-col pt-4">
              <div className="flex justify-between">
                <h4 className="md:my-2 flex items-center gap-x-1">
                  <span>
                    <GoLocation className="text-3xl text-green-700" />
                  </span>
                  {""}
                  Baguio City
                  <br /> Benguet, Philippines
                </h4>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.kurkboard.xyz/"
                  className="md:my-2 flex items-center gap-x-1 hover:underline hover:text-blue-400"
                >
                  <FaGlobe className="text-3xl" /> www.kurkboard.xyz
                </a>
              </div>
              <div className="flex justify-between">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="mailto:kurkboard@gmail.com"
                  className="md:my-2 flex hover:underline"
                >
                  <MdEmail className="text-3xl text-red-600" /> kurkboard
                  <br className="lg:hidden" />
                  @gmail.com
                </a>
                <h4 className="md:my-2 flex ">
                  <FaPhoneAlt className="text-3xl text-green-600" />{" "}
                  +639-995-934-9677
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DevCard;
