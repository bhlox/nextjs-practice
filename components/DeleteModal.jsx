import React from "react";

function DeleteModal({ handleDelete, setShowDeleteMsg, title, comment }) {
  return (
    <>
      <div
        onClick={() => setShowDeleteMsg(false)}
        className="fixed top-0 left-0 h-screen w-screen z-10 flex justify-center items-center bg-slate-800 bg-opacity-40 backdrop-blur-[1px]"
      ></div>
      <div className="">
        <div className="dark:bg-slate-700 bg-gray-300 dark:text-stone-200 text-slate-800 p-6 flex flex-col justify-center items-center space-y-8 max-w-sm rounded-xl z-20 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-xl">
            You are about this delete this {title ? "post" : "comment"} &ldquo;
            <span className="font-bold text-2xl">
              {title ? title : comment}
            </span>
            &ldquo;
          </h2>
          <div className="flex flex-col justify-center space-y-6 md:space-y-0 md:flex-row md:space-x-12 items-center">
            <button
              className="rounded-xl p-2 dark:border-stone-200 border-slate-800 border-2 transition-all hover:scale-125 hover:opacity-80"
              onClick={() => setShowDeleteMsg(false)}
            >
              Hold on
            </button>
            <button
              onClick={() => {
                handleDelete();
                setShowDeleteMsg(false);
              }}
              className="rounded-xl p-2 dark:border-stone-200 border-slate-800 border-2 transition-all hover:scale-125 hover:opacity-80"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteModal;
