import Link from "next/link";

export default function SidePosts(props) {
  return (
    <Link passHref href={`/post/${props.id}`}>
      <div className="w-1/2 md:w-full p-2 cursor-pointer group">
        <div className="rounded-xl dark:bg-slate-700 bg-gray-300">
          <div className="overflow-hidden">
            <img
              className="h-32 w-full object-cover group-hover:scale-125 transition-all rounded-t-xl"
              src={props.image}
              alt=""
            />
          </div>
          <div className="p-2">
            <h3 className="text-xl font-medium group-hover:underline">
              {props.title.substring(0, 43)}...
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
