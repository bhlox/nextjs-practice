import { RiMailSendLine } from "react-icons/ri";
import {
  FaCamera,
  FaEdit,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { uiActions } from "./store/ui-slice";
import Link from "next/link";

export default function ProfileCard({
  handleSaveName,
  setCurrentName,
  setEditingName,
  editingName,
  handleChangeSocials,
  handleProfPic,
  previewCover,
  previewProf,
  handleSaveSocials,
  currentName,
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
  passwordInputRef,
  self,
  addSocials,
  setAddSocials,
  facebookInputRef,
  twitterInputRef,
  instagramInputRef,
  previewSocials,
  timestamp,
  email,
}) {
  const dispatch = useDispatch();

  const handleEmail = () => {
    window.open(`mailto:${email}?subject=Title&body=Enter%message%20here`);
  };

  return (
    <div className="border-2 border-blue-500 relative">
      <div className="relative border-b-2">
        {self && (
          <label
            htmlFor="coverPic"
            className="absolute top-5 right-5 overflow-hidden text-3xl hover:opacity-80"
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
        )}
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

            {self && (
              <label
                className="absolute bottom-2 right-2 md:bottom-4 md:right-4 overflow-hidden text-3xl hover:opacity-80"
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
            )}
          </div>
        </div>
        {/* END PROF PIC */}
      </div>

      {/* INFO */}
      <div className="flex flex-row justify-between md:items-start mt-20 md:mt-4 p-4 pt-0">
        <div className="md:ml-52 space-y-4">
          <div className="">
            {!isEditingUserName && (
              <div className="flex space-x-2">
                <h2 className="text-4xl font-bold">{currentUsername}</h2>
                {self && (
                  <span
                    onClick={handleUserName}
                    className="text-lg cursor-pointer hover:opacity-80"
                  >
                    <FaEdit />
                  </span>
                )}
              </div>
            )}
            {isEditingUserName && (
              <div>
                <div className="space-x-4">
                  <span>enter new username</span>
                  <span
                    onClick={() => handleCancel("username")}
                    className="cursor-pointer text-2xl"
                  >
                    X
                  </span>
                </div>
                <div>
                  <input
                    className="styled-input p-0 text-lg md:text-xl"
                    ref={usernameInputRef}
                    type="text"
                    onChange={handleUsernameCount}
                    value={currentUsername}
                    maxLength={15}
                    required
                    min={3}
                  />
                  <span> {textLength} / 15</span>
                </div>
                <div>
                  <h2>confirm password</h2>
                  <input
                    className="styled-input p-0 text-lg md:text-xl"
                    ref={passwordInputRef}
                    type="password"
                    name="password"
                    id="password"
                  />
                </div>
                <button onClick={handleSaveUserName}>save</button>
              </div>
            )}
            <div>
              <div className="">
                {!editingName && (
                  <div className="flex space-x-2">
                    {!currentName && (
                      <h2 className="text-xl font-light">add full name</h2>
                    )}
                    <h2 className="text-xl font-light">{currentName}</h2>
                    {self && (
                      <span
                        className="cursor-pointer text-lg hover:opacity-80"
                        onClick={() => setEditingName(true)}
                      >
                        <FaEdit />
                      </span>
                    )}
                  </div>
                )}
                {editingName && (
                  <>
                    <div className="flex space-x-4">
                      <p className="text-xl">Enter full name</p>
                      <span
                        className="cursor-pointer text-xl font-bold"
                        onClick={() => handleCancel("name")}
                      >
                        X
                      </span>
                    </div>
                    <input
                      value={currentName}
                      className="styled-input p-0 text-lg block"
                      type="text"
                      onChange={(e) => setCurrentName(e.target.value)}
                    />
                    <button onClick={handleSaveName}>save</button>
                  </>
                )}
              </div>
              <h2 className="text-base font-light">
                Joined since: <span>{timestamp}</span>
              </h2>
            </div>
          </div>
          {/* SET UP ABOUT ME IF NO ABOUT ME YET */}
          <div>
            <div className="">
              {!showEdit && (
                <div className="flex space-x-2">
                  <h2 className="text-2xl ">About me</h2>
                  {self && (
                    <span
                      className="cursor-pointer text-lg hover:opacity-80"
                      onClick={handleEdit}
                    >
                      <FaEdit />
                    </span>
                  )}
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
        <div className="inline-block -mt-[4.5rem] md:block md:mt-0 space-y-4">
          {/* MAP HERE LIST OF CONTACT ON USER PROFILE */}
          <div>
            <h3 className="text-xl md:text-2xl">Contact me</h3>
            <div className="flex items-center space-x-2">
              <a
                className="cursor-pointer hover:opacity-80 text-2xl"
                target="_blank"
                onClick={handleEmail}
              >
                <RiMailSendLine />
              </a>
              <h4 className="text-lg">{email}</h4>
            </div>
          </div>

          <div>
            <div className="flex space-x-2">
              <h2 className="text-2xl ">Socials</h2>

              {self && !addSocials && (
                <span
                  className="cursor-pointer text-lg hover:opacity-80"
                  onClick={() => setAddSocials((prev) => !prev)}
                >
                  <FaEdit />
                </span>
              )}

              {addSocials && (
                <span
                  className="cursor-pointer text-lg font-bold"
                  onClick={() => handleCancel("socials")}
                >
                  X
                </span>
              )}
            </div>
            <div className="flex space-x-4 mt-1">
              {!addSocials && previewSocials.facebook && (
                <Link
                  passHref
                  href={`https://www.facebook.com/${previewSocials.facebook}`}
                >
                  <a
                    target="_blank"
                    className="cursor-pointer text-3xl text-blue-500 hover:opacity-80"
                  >
                    <FaFacebook />
                  </a>
                </Link>
              )}

              {!addSocials && previewSocials.twitter && (
                <Link
                  passHref
                  href={`https://www.twitter.com/${previewSocials.twitter}`}
                >
                  <a
                    target="_blank"
                    className="cursor-pointer text-3xl hover:opacity-80 text-blue-400"
                  >
                    <FaTwitter />
                  </a>
                </Link>
              )}

              {!addSocials && previewSocials.instagram && (
                <Link
                  passHref
                  href={`https://www.instagram.com/${previewSocials.instagram}`}
                >
                  <a
                    target="_blank"
                    className="cursor-pointer text-3xl hover:opacity-80 text-orange-300"
                  >
                    <FaInstagram />
                  </a>
                </Link>
              )}
            </div>
            {addSocials && (
              <>
                <div className="space-y-4">
                  <div className="flex">
                    <span className="text-xl">
                      <FaFacebook />
                    </span>
                    <input
                      className="styled-input p-0 text-2xl"
                      ref={facebookInputRef}
                      name="facebook"
                      type="text"
                      placeholder="enter username"
                      value={previewSocials.facebook}
                      onChange={handleChangeSocials}
                    />
                  </div>
                  <div className="flex">
                    <span className="text-xl">
                      <FaTwitter />
                    </span>
                    <input
                      className="styled-input p-0 text-2xl"
                      name="twitter"
                      ref={twitterInputRef}
                      type="text"
                      placeholder="enter username"
                      value={previewSocials.twitter}
                      onChange={handleChangeSocials}
                    />
                  </div>
                  <div className="flex">
                    <span className="text-xl">
                      <FaInstagram />
                    </span>
                    <input
                      className="styled-input p-0 text-2xl"
                      name="instagram"
                      ref={instagramInputRef}
                      type="text"
                      placeholder="enter username"
                      value={previewSocials.instagram}
                      onChange={handleChangeSocials}
                    />
                  </div>
                </div>
                <div className="flex md:justify-end mt-2">
                  <button
                    onClick={handleSaveSocials}
                    className="px-2 border-2 rounded-2xl hover:opacity-80"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
