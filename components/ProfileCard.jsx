import { RiMailSendLine } from "react-icons/ri";
import { FaCamera, FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { uiActions } from "./store/ui-slice";

export default function ProfileCard({
  handleProfPic,
  previewCover,
  previewProf,
  username,
  name,
  handleCancel,
  showEdit,
  currentAbout,
  aboutInputRef,
  handleCount,
  textLength,
  handleAboutMe,
  handleEdit,
  isEditingUserName,
  handleUserName,
  handleSaveUserName,
  usernameInputRef,
  setCurrentUsername,
  currentUsername,
  handleUsernameCount,
}) {
  const dispatch = useDispatch();

  return (
    <div className="border-2 border-blue-500 relative">
      <div className="relative border-b-2">
        <label
          htmlFor="coverPic"
          className="absolute top-5 right-5 overflow-hidden text-3xl "
        >
          <FaCamera />
          <input
            type="file"
            name="coverPic"
            id="coverPic"
            accept=".jpg, .jpeg, .png"
            className="absolute top-0 right-0 cursor-pointer"
            onChange={handleProfPic}
          />
        </label>
        <img
          className=" h-[360px] w-full md:h-[312px] object-cover object-center rounded-t-xl"
          src={previewCover}
          alt=""
        />
        {/* PROF PIC */}
        <div className="absolute -bottom-[5rem] left-5 translate-x-0">
          <div className="relative max-w-max">
            <img
              className="h-36 w-36 md:h-48 md:w-48 rounded-full border-2 object-cover object-center relative"
              src={previewProf}
              alt=""
            />

            <label
              className="absolute bottom-2 right-2 md:bottom-4 md:right-4 overflow-hidden text-3xl"
              htmlFor="profPic"
            >
              <FaCamera />
              <input
                type="file"
                name="profPic"
                id="profPic"
                accept=".jpg, .jpeg, .png"
                className="absolute bottom-0 right-0 cursor-pointer"
                onChange={handleProfPic}
              />
            </label>
          </div>
        </div>
        {/* END PROF PIC */}
      </div>

      {/* INFO */}
      <div className="flex flex-row justify-between md:items-start mt-20 md:mt-4 p-4 pt-0">
        <div className="md:ml-52 space-y-4">
          <div>
            {!isEditingUserName && (
              <div className="flex space-x-2">
                <h2 className="text-4xl font-bold">{currentUsername}</h2>
                <span
                  onClick={handleUserName}
                  className="text-lg cursor-pointer"
                >
                  <FaEdit />
                </span>
              </div>
            )}
            {isEditingUserName && (
              <div>
                <div>
                  <span
                    onClick={() => handleCancel("username")}
                    className="cursor-pointer text-2xl"
                  >
                    X
                  </span>
                </div>
                <div>
                  <input
                    ref={usernameInputRef}
                    type="text"
                    onChange={handleUsernameCount}
                    value={currentUsername}
                    maxLength={15}
                  />
                  <span> {textLength} / 15</span>
                </div>
                <button onClick={handleSaveUserName}>save</button>
              </div>
            )}
            <h2 className="text-xl">{name}</h2>
            <h2 className="text-xl">joined since: </h2>
          </div>
          {/* SET UP ABOUT ME IF NO ABOUT ME YET */}
          <div>
            <div className="">
              {!showEdit && (
                <div className="flex space-x-2">
                  <h2 className="text-2xl ">About me</h2>
                  <span className="cursor-pointer text-lg" onClick={handleEdit}>
                    <FaEdit />
                  </span>
                </div>
              )}
              {showEdit && (
                <span
                  className="cursor-pointer text-3xl font-bold"
                  onClick={() => handleCancel("about")}
                >
                  X
                </span>
              )}
            </div>
            {!showEdit && (
              <p className="text-xl font-medium max-w-3xl">{currentAbout}</p>
            )}
            {showEdit && (
              <div className="">
                <textarea
                  id="title"
                  cols="80"
                  rows="3"
                  ref={aboutInputRef}
                  placeholder="Enter title..."
                  className="resize w-full overflow-hidden bg-transparent text-xl font-semibold border-b-2 focus:outline-none p-2 text-gray-200"
                  onChange={handleCount}
                  value={currentAbout}
                  maxLength="100"
                />
                <div className="flex justify-between">
                  <span className="">{textLength} / 100</span>
                  <button onClick={handleAboutMe} className="">
                    save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="inline-block -mt-[4.5rem] md:block md:mt-0">
          <button>edit/add contacts</button>
          {/* <h3 className="text-xl md:text-2xl">Contact me</h3> */}
          {/* MAP HERE LIST OF CONTACT ON USER PROFILE */}
          <div>
            <button>
              <RiMailSendLine />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
