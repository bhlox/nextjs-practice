import Link from "next/link";
import { FaTwitter, FaFacebook, FaShareAlt } from "react-icons/fa";

export default function PostInfo({ username, timestamp, userpic }) {
  return (
    <div className="flex md:flex-col justify-between items-center md:items-start space-y-8">
      <div className="post-details flex flex-col">
        <div className="flex items-center space-x-2">
          <h4>Post by:</h4>
          <Link passHref href={`/user/${username}`}>
            <img
              className="rounded-full w-10 h-10 cursor-pointer object-cover"
              src={userpic}
              alt=""
            />
          </Link>
          <Link passHref href={`/user/${username}`}>
            <span className="post-user">{username}</span>
          </Link>
        </div>
        <h2>posted at: {timestamp}</h2>
      </div>
      <div className="flex space-x-4">
        <FaFacebook className="share-icon text-blue-500" />
        <FaTwitter className="share-icon text-blue-400" />
        <FaShareAlt className="share-icon text-yellow-300" />
      </div>
    </div>
  );
}
