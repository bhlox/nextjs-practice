import Link from "next/link";
import React from "react";
import { MdEmail } from "react-icons/md";
import { FaTwitter, FaGithub } from "react-icons/fa";

function Footer() {
  const handleEmail = () => {
    window.open(
      `mailto:kurkboard@gmail.com?subject=Title&body=enter message here`
    );
  };

  return (
    <footer className="bg-slate-700 text-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center space-y-3 md:justify-between p-4 md:space-y-0">
        <h2 className="flex gap-x-1 font-light text-lg">
          Copyright &copy; 2022 Readis Blogs | Website by
          {/* <Link passHref href="www.kurkboard.com"> */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.kurkboard.xyz/"
            className="hover:underline hover:text-blue-400 text-xl"
          >
            Kurk
          </a>
          {/* </Link> */}
        </h2>
        <div className="flex space-x-3">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:kurkboard@gmail.com"
            className="text-3xl hover:opacity-80 cursor-pointer"
          >
            <MdEmail />
          </a>
          {/* <Link passHref href={"twitter.com"}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl hover:opacity-80"
            >
              <FaTwitter />
            </a>
          </Link> */}
          {/* <Link passHref href={"github.com"}> */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:opacity-80"
            href="https://github.com/bhlox"
          >
            <FaGithub />
          </a>
          {/* </Link> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
