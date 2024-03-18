import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import user from "../../assets/Images/user.png";
import { IoClose } from "react-icons/io5";
import {
  createdDate,
  replyCommentData,
  singlePostData,
} from "../../helper/fetchTweetData";
import { getUserData } from "../../helper/userProfileData";
import { AiOutlinePicture } from "react-icons/ai";

const ReplyTweet = ({ tweet, setTweet, postId }) => {
  const [inputValue, setInputValue] = useState("");
  const [postData, setPostData] = useState({});
  const [userData, setUserData] = useState({});
  const [upload, setUpload] = useState("");
  const [fileName, setFileName] = useState("");

  const getPostData = async () => {
    const data = await singlePostData(postId);
    setPostData(data);
  };

  const getUserDetails = async () => {
    const data = await getUserData();
    setUserData(data);
  };

  const commentData = async () => {
    const createdAt = createdDate();
    await replyCommentData(postId, inputValue, createdAt, fileName);
    setTweet(false);
    setInputValue("");
    setUpload("");
    setFileName("");
  };

  const handleFileChange = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
    setFileName(e.target.files[0]);
    setUpload(img);
  };
  useEffect(() => {
    getPostData();
    getUserDetails();
  }, [postId]);

  return (
    <Transition.Root show={tweet} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setTweet}>
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
                  <div className="">
                    <div className="p-6">
                      <div className="flex justify-between">
                        <button
                          onClick={() => {
                            setTweet(false);
                            setUpload("");
                            setFileName("");
                          }}
                          className="text-[#EF9595] text-[24px]"
                        >
                          <IoClose />
                        </button>
                        <button
                          disabled={inputValue.length < 17}
                          className={`${
                            inputValue.length < 17 ? "opacity-[0.6]" : ""
                          } bg-[#EF9595] text-white p-[3px_18px] rounded-2xl`}
                          onClick={commentData}
                        >
                          Send
                        </button>
                      </div>
                      <div className="min-h-[300px]">
                        <div className="flex items-start justify-between sm:gap-[20px] gap-[14px] mt-[20px] mb-[10px] relative after:absolute after:content-[''] after:h-full z-[-1] after:w-[2px] after:top-[35px] after:left-[17px] after:bg-[#aaa]">
                          <div className="flex justify-between sm:gap-[20px] gap-[14px]">
                            <img
                              src={postData?.user?.profilePic || user}
                              alt="user"
                              className="sm:w-[35px] w-[35px] h-[35px] rounded-full object-cover"
                            />
                            <div>
                              <h2 className="font-semibold text-[16px] leading-[18px]">
                                {postData?.user?.displayName}
                                <span className="text-[#5c5c5c]">
                                  {postData?.user?.userName}
                                </span>
                              </h2>
                              <p className="text-[12px] leading-[12px] text-[#5c5c5c] pt-1">
                                {postData?.description}
                              </p>
                              <p className="text-[#888] text-[12px] mt-[20px] font-medium">
                                Replying to{" "}
                                <span className="text-[#EF9595]">@t</span>
                                .landlord5235
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start sm:gap-[20px] gap-[14px] mt-[10px] mb-[10px]">
                          <img
                            src={userData?.profilePic || user}
                            alt="user"
                            className="sm:w-[35px] w-[35px] h-[35px] rounded-full object-cover"
                          />
                          <textarea
                            value={inputValue}
                            name="description"
                            onChange={(e) => setInputValue(e.target.value)}
                            type="text"
                            placeholder="Post your reply"
                            className="placeholder:text-[#4d4d4d] outline-none w-full resize-none sm:text-[18px] text-[14px]"
                          />
                        </div>
                        <div>
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
                          onChange={(e) => handleFileChange(e)}
                          type="file"
                          className="text-[#EF9595] w-[30px] h-[30px] opacity-0 absolute"
                        />
                        <AiOutlinePicture className="text-[#EF9595] text-[30px]" />
                      </div>
                      <button
                        className={`sm:w-[40px] w-[30px] sm:h-[40px] h-[30px] border-[#727272] sm:border-[5px] border-[4px] rounded-full  `}
                      ></button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReplyTweet;
