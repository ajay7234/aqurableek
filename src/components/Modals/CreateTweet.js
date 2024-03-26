import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import user from "../../assets/Images/user.png";
import { IoClose } from "react-icons/io5";
import { AiOutlinePicture } from "react-icons/ai";
import { uploadPostData } from "../../helper/filterTweetData";
import { toast } from "react-toastify";
import { getUserData } from "../../helper/userProfileData";
import { useNavigate } from "react-router-dom";

const CreateTweet = ({ open, setOpen, showCloseBtn, userId, isSignup }) => {
  const [inputValue, setInputValue] = useState("");
  const [upload, setUpload] = useState();
  const [fileName, setFileName] = useState("");
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const handlePostData = async (userId) => {
    if (inputValue === "") {
      toast.error("description is required for post");
    } else if (inputValue.length < 17 || inputValue.length > 170) {
      toast.error("Post length should be between 17 and 170 characters.");
    } else {
      await uploadPostData(inputValue, userId, fileName);
      setOpen(false);
      navigate("/dashboard");
    }
  };

  const getUserProfile = async () => {
    const data = await getUserData();
    setUserData(data);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];

      if (!imageExtensions.includes(fileExtension)) {
        toast.error("Unsupported file type. Please upload an image.");
        return;
      }

      const img = URL.createObjectURL(file);
      setFileName(file);
      setUpload(img);
    }
  };

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-[560px]">
                  <div>
                    <div className="p-6">
                      <div
                        className={
                          showCloseBtn
                            ? "flex justify-between"
                            : "flex justify-end"
                        }
                      >
                        {showCloseBtn && (
                          <button
                            onClick={() => {
                              setOpen(false);
                            }}
                            className="text-[#EF9595] text-[24px]"
                          >
                            <IoClose />
                          </button>
                        )}
                        <button
                          className="bg-[#EF9595] d-flex jus text-white p-[3px_18px] rounded-2xl"
                          onClick={() => handlePostData(userId)}
                        >
                          Send
                        </button>
                      </div>
                      <div className="min-h-[300px]">
                        <div className="flex items-start sm:gap-[20px] gap-[14px] mt-[20px] mb-[10px]">
                          <img
                            src={userData?.profilePic || user}
                            alt="user"
                            className="sm:w-[40px] w-[40px] h-[39px] rounded-full object-cover"
                          />
                          <div className="w-full relative">
                            <textarea
                              value={inputValue}
                              name="description"
                              onChange={(e) => setInputValue(e.target.value)}
                              type="text"
                              placeholder={
                                isSignup
                                  ? "Please enter your first message/word to the world using your language (17 to 170 characters)\n"
                                  : "What's happening?"
                              }
                              className="placeholder:text-[#4d4d4d] outline-none w-full resize-none text-[14px] pb-[20px]"
                            />
                            {isSignup && !inputValue.trim() && (
                              <p className="text-[#4d4d4d] flex justify-end select-none absolute right-0 bottom-0">
                                رسالة/كلمة للأمة
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <div className="max-w-[360px] sm:h-[220px] h-[200px] ml-auto rounded-lg">
                            {upload && (
                              <>
                                <img
                                  src={upload}
                                  alt="user3"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t-[#ccc] border-t-[1px] p-[10px_20px] flex justify-between items-center">
                      <div className="relative">
                        <input
                          type="file"
                          className="text-[#EF9595] w-[30px] h-[30px] opacity-0 absolute"
                          onChange={(e) => handleFileChange(e)}
                        />
                        <AiOutlinePicture className="text-[#EF9595] text-[30px]" />
                      </div>
                      <button className="sm:w-[40px] w-[30px] sm:h-[40px] h-[30px] border-[#727272] sm:border-[5px] border-[4px] rounded-full"></button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default CreateTweet;
