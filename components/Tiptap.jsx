import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaParagraph,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import {
  RiH1,
  RiH2,
  RiH3,
  RiFontSize,
  RiImageAddFill,
  RiListUnordered,
  RiListOrdered,
  RiChatQuoteFill,
} from "react-icons/ri";
import { GoHorizontalRule } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { imageActions } from "./store/image-slice";
import { textActions } from "./store/text-slice";

const MenuBar = ({ editor }) => {
  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap text-3xl mt-1 border-b-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "active-font-btn group" : "font-btn group"
          }
        >
          <FaBold />
          <span className="font-tooltip group-hover:inline-block">Bold</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <FaItalic />
          <span className="font-tooltip group-hover:inline-block">Italic</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <FaStrikethrough />
          <span className="font-tooltip group-hover:inline-block">
            Strikethrough
          </span>
        </button>
        {/* <button onClick={() => editor.chain().focus().clearNodes().run()}>
          clear nodes
        </button> */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph")
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <FaParagraph />
          <span className="font-tooltip group-hover:inline-block">
            Paragraph
          </span>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <RiH1 />
          <span className="font-tooltip group-hover:inline-block">
            heading 1
          </span>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <RiH2 />
          <span className="font-tooltip group-hover:inline-block">
            heading 2
          </span>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <RiH3 />
          <span className="font-tooltip group-hover:inline-block">
            heading 3
          </span>
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 })
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <RiFontSize />
          <span className="font-tooltip group-hover:inline-block">
            regular size
          </span>
        </button>
        <button onClick={addImage} className="font-btn group">
          <RiImageAddFill />
          <span className="font-tooltip group-hover:inline-block">
            add image
          </span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <RiListUnordered />
          <span className="font-tooltip group-hover:inline-block">
            bullet list
          </span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <RiListOrdered />
          <span className="font-tooltip group-hover:inline-block">
            numbered list
          </span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote")
              ? "active-font-btn group"
              : "font-btn group"
          }
        >
          <RiChatQuoteFill />
          <span className="font-tooltip group-hover:inline-block">
            blockquote
          </span>
        </button>
        <button
          className="font-btn group"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <GoHorizontalRule />
          <span className="font-tooltip group-hover:inline-block">
            horizontal rule
          </span>
        </button>
        <button
          className="font-btn group"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <FaUndo />
          <span className="font-tooltip group-hover:inline-block">undo</span>
        </button>
        <button
          className="font-btn border-0 group"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <FaRedo />
          <span className="font-tooltip group-hover:inline-block">redo</span>
        </button>
      </div>
    </>
  );
};

const Tiptap = ({
  handleCount,
  titleInput,
  summaryInput,
  categoryInput,
  imageInput,
}) => {
  const titleCount = useSelector((state) => state.text.titleLength);
  const summaryCount = useSelector((state) => state.text.summaryLength);
  const previewImg = useSelector((state) => state.image.previewImg.data_url);

  //   const [previewImg, setPreviewImg] = useState("");

  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        emptyNodeClass: "before:content-['Write_Something...']",
      }),
    ],
    // content: "start here",
    editorProps: {
      attributes: {
        class:
          "w-full prose prose-sm sm:prose-invert sm:prose lg:prose-lg xl:prose-2xl px-2 my-8",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      // console.log(json);
      //   setToAdd(json);
      dispatch(textActions.setDesc(json));
    },
  });

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      // console.log(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // setPreviewImg(reader.result);
        dispatch(
          imageActions.setPreview({
            name: file.name,
            data_url: reader.result,
          })
        );
        // console.log(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="space-y-12 p-2 bg-slate-700 pt-4 rounded-xl">
        <div className="space-y-3">
          <h2 className="text-3xl font-medium">Select category</h2>
          <select
            name="category"
            id="category"
            ref={categoryInput}
            className="text-black"
          >
            <option value="business">business</option>
            <option value="lifestyle">lifestyle</option>
            <option value="mental">mental health</option>
            <option value="freelance">freelance</option>
            <option value="casual">casual</option>
            <option value="travel">travel</option>
            <option value="love">love</option>
          </select>
        </div>
        <div className="relative">
          <textarea
            id="title"
            rows="1"
            ref={titleInput}
            placeholder="Enter title..."
            className="resize w-full overflow-hidden bg-transparent text-3xl font-semibold border-b-2 focus:outline-none p-2 text-gray-200"
            onChange={handleCount}
            maxLength="100"
          />
          <span>{titleCount} / 100</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-medium">Set Thumbnail Picture</h3>
          <input
            type="file"
            id="upload"
            accept=".jpg, .jpeg, .png"
            onChange={handleImagePreview}
          />
          {previewImg && (
            <div>
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imageInput}
                  src={previewImg}
                  alt="image-preview"
                  className="h-60 w-60 object-cover rounded-2xl border-2"
                />
              }
            </div>
          )}
        </div>

        <div className="p-2 pt-1 rounded-xl border-2">
          <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl">
            Summary <span>tooltip here</span>
          </h2>
          <textarea
            id="summary"
            rows="1"
            ref={summaryInput}
            placeholder="Enter summary..."
            className="resize w-full overflow-hidden bg-transparent text-3xl font-semibold border-2 focus:outline-none p-2 rounded text-gray-200"
            onChange={handleCount}
            maxLength="100"
          />
          <span>{summaryCount} / 100</span>
        </div>
      </div>
    </>
  );
};

export default Tiptap;

// PREVIEWING IMG AFTER UPLOAD REF: https://www.youtube.com/watch?v=BPUgM1Ig4Po&list=LL&index=2&t=618s
