import Link from "next/link";
import { FaTwitter, FaFacebook, FaShareAlt } from "react-icons/fa";

export default function PostInfo({ username, timestamp }) {
  return (
    <div className="flex md:flex-col justify-between items-center md:items-start space-y-8">
      <div className="post-details flex flex-col">
        <div>
          <Link passHref href={`/user/${username}`}>
            <h4>
              Post by: <span className="post-user">{username}</span>
            </h4>
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
