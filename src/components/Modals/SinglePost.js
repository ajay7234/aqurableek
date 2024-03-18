import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { HiEye } from "react-icons/hi";
import { IoMdShare } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { TiArrowUpOutline } from "react-icons/ti";
import { updateLikeList } from "../../helper/fetchTweetData";
import ReplyTweet from "./ReplyTweet";

function SinglePost({ post, setPost, postData }) {
  const [tweet, setTweet] = useState(false);
  const [postId, setPostId] = useState("");

  useEffect(() => {}, [postData]);

  const handleLike = async (postId) => {
    await updateLikeList(postId);
    setPost(false);
  };

  return (
    <div>
      <Transition.Root show={post} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setPost}>
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
                  <div className="flex justify-end p-[24px] pb-0">
                    <button
                      onClick={() => setPost(false)}
                      className="text-[#EF9595] text-[24px]"
                    >
                      <IoClose />
                    </button>
                  </div>
                  <div className="sm:p-[20px] p-[14px] border-b-[#c0bbbb] border-b-[1px]">
                    <div className="flex items-start sm:gap-[20px] gap-[14px]">
                      <img
                        src={postData?.user?.profilePic}
                        alt="user"
                        className="sm:w-[50px] w-[40px] sm:h-[50px] h-[40px] rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-[18px] font-semibold">
                          {postData?.user?.displayName}
                        </h2>
                        <p className="text-[#5c5c5c] font-medium text-[14px]">
                          {postData?.user?.userName}
                        </p>
                        <p className="text-[#5c5c5c] text-[12px] mt-[10px]">
                          {postData?.description}
                        </p>
                        <div className="flex gap-[24px] mt-[20px] flex-wrap">
                          <button
                            className={`flex gap-[16px] text-[14px] `}
                            onClick={() => handleLike(postData?.id)}
                          >
                            <TiArrowUpOutline
                              className={`text-[24px] text-[#5c5c5c]`}
                            />
                            {postData?.likeList?.length}
                          </button>
                          <button
                            onClick={() => {
                              setTweet(true);
                              setPostId(postData?.id);
                              setPost(false);
                            }}
                            className="flex gap-[16px] text-[14px] text-[#5c5c5c]"
                          >
                            <MdMessage className="text-[24px] text-[#5c5c5c]" />
                            {postData?.commentCount}
                          </button>

                          <button className="flex gap-[16px] text-[14px]">
                            <HiEye className="text-[24px] text-[#5c5c5c]" />
                            {postData?.viewsList?.length}
                          </button>
                          <button className="text-[14px]">
                            <IoMdShare className="text-[24px] text-[#5c5c5c]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ReplyTweet tweet={tweet} setTweet={setTweet} postId={postId} />
    </div>
  );
}

export default SinglePost;
