import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti";
import { MdKeyboardBackspace, MdMessage } from "react-icons/md";
import { HiEye } from "react-icons/hi";
import { IoMdShare } from "react-icons/io";
import ReplyTweet from "./ReplyTweet";
import { getCurrentUserData } from "../../helper/userProfileData";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaLink } from "react-icons/fa6";
import { toast } from "react-toastify";
import NotFound from "../../assets/Images/not-found.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ImageViewer = ({ imageViewer, setImageViewer, postData, handleLike }) => {
  const [tweet, setTweet] = useState(false);
  const [postId, setPostId] = useState("");
  const [userData, setUserData] = useState({});

  const fetchCurrentUser = async () => {
    const data = await getCurrentUserData();
    setUserData(data);
  };
  const handleCopySuccess = () => {
    toast.success("Link copied to clipboard!");
  };
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div>
      <Transition.Root show={imageViewer} as={Fragment}>
        <Dialog as="div" className="relative z-[99]" onClose={setImageViewer}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#000] bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-[999] w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center p-2 text-center items-center sm:p-0 w-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[500px] p-[20px]">
                  <div>
                    <button
                      onClick={() => setImageViewer(false)}
                      className="text-[24px] mb-3 outline-none text-[#EF9595]"
                    >
                      <MdKeyboardBackspace />
                    </button>

                    {postData?.imagePath &&
                    /\.(jpg|jpeg|png|svg)(?=\?alt=media)/i.test(
                      postData?.imagePath
                    ) ? (
                      <img
                        src={postData?.imagePath}
                        alt="post_image"
                        onError={({ currentTarget }) => {
                          currentTarget.src = NotFound;
                          currentTarget.classList = "opacity-60 rounded-[10px]";
                        }}
                      />
                    ) : (
                      <></>
                    )}

                    <div className="flex gap-[24px] mt-[20px] flex-wrap">
                      <button
                        className={`flex sm:gap-[16px] gap-[6px] text-[16px] items-center `}
                        onClick={() => handleLike(postData?.id)}
                      >
                        {postData?.likeList?.includes(userData?.userId) ? (
                          <TiArrowUpThick className="sm:text-[24px] text-[20px] text-[green]" />
                        ) : (
                          <TiArrowUpOutline className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                        )}
                        {postData?.likeList?.length || 0}
                      </button>
                      <button
                        // onClick={() => {
                        //   setTweet(true);
                        //   setPostId(postData?.id);
                        //   setImageViewer(false);
                        // }}
                        className="flex  sm:gap-[16px] gap-[6px] text-[14px]"
                      >
                        <MdMessage className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                        {postData?.commentCount || 0}
                      </button>

                      <button className="flex  sm:gap-[16px] gap-[6px] text-[14px]">
                        <HiEye className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                        {postData?.viewsList && postData?.viewsList?.length * 3}
                      </button>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div className="flex items-center">
                          <Menu.Button className="text-[14px]">
                            <IoMdShare className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <CopyToClipboard
                                    text="https://aqurableek-5rhg.vercel.app/dashboard"
                                    onCopy={handleCopySuccess}
                                  >
                                    <div
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "px-4 py-2 text-sm flex gap-2 cursor-pointer"
                                      )}
                                    >
                                      <FaLink className="text-[18px]" />
                                      Share Link
                                    </div>
                                  </CopyToClipboard>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      {/* <div className="relative w-full">
                        <input
                          type="text"
                          placeholder="Comment here..."
                          className="p-[8px_10px] border-[1px] border-[#ccc] rounded-[30px] text-[14px] w-full outline-none"
                        />
                        <button className="absolute top-[50%] right-[10px] translate-y-[-50%]">
                          <IoSendSharp />
                        </button>
                      </div> */}
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
};

export default ImageViewer;
