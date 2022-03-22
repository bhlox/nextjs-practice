import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentsActions } from "./store/comments-slice";

function CommentTextArea({
  pic,
  message,
  // content,
  // handleChange,
  handleSubmit,
}) {
  const dispatch = useDispatch();
  const commentInputRef = useRef();

  const { content } = useSelector((state) => state.comments);

  const handleChange = (e) => {
    dispatch(commentsActions.setContent(e.target.value));
    // setcontent(e.target.value);
    commentInputRef.current.style.height =
      Math.min(commentInputRef.current.scrollHeight, 300) + "px";
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-4 pb-8">
      <div>
        <img className="w-20 h-20 rounded-full object-cover" src={pic} alt="" />
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-4">
          <p>{content.length} / 300</p>
          <p className="text-red-400 text-lg">{message.error}</p>
        </div>
        <textarea
          ref={commentInputRef}
          className={`resize w-full overflow-auto bg-transparent text-3xl font-semibold border-slate-800 dark:border-stone-200 border-b-2 focus:outline-none p-2 dark:text-gray-200 dark:bg-slate-600 bg-gray-300`}
          name="addComment"
          id="addComment"
          rows="1"
          cols="40"
          placeholder="Enter comment..."
          onChange={handleChange}
          value={content}
          maxLength="300"
        />
        {content && (
          <button
            disabled={!content.length}
            className="w-full bg-red-400 text-2xl rounded p-1"
            onClick={handleSubmit}
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentTextArea;
