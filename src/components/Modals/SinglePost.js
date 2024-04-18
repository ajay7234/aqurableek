import { Dialog, Menu, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { HiEye } from "react-icons/hi";
import { IoMdShare } from "react-icons/io";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti";
import ReplyTweet from "./ReplyTweet";
import NotFound from "../../assets/Images/not-found.png";
import ImageViewer from "./ImageViewer";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaLink } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatTimeDifference } from "../../helper/formateTiming";
import { useSelector } from "react-redux";
import Avtar from "../../assets/Images/user.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SinglePost({ post, setPost, postData, setPostData, handleLike }) {
  const [tweet, setTweet] = useState(false);
  const [postId, setPostId] = useState("");
  const [imageViewer, setImageViewer] = useState(false);
  const [singlePost, setSinglePost] = useState({});
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.data?.userData);
  const tweetVoice = useSelector((state) => state.user.tweetVoice);
  const tweetCountry = useSelector((state) => state.user.tweetCountry);
  const tweetEnglish = useSelector((state) => state.user.englishPost);

  const handleCopySuccess = () => {
    toast.success("Link copied to clipboard!");
  };
  useEffect(() => {
    if (userData) {
      const tweetVoiceData = tweetVoice[`${postData.id}`];
      const tweetCountryData = tweetCountry[`${postData.id}`];
      const englishPostData = tweetEnglish[`${postData.id}`];

      if (tweetVoiceData) {
        setPostData(tweetVoiceData);
      } else if (tweetCountryData) {
        setPostData(tweetCountryData);
      } else if (englishPostData) {
        setPostData(englishPostData);
      }
    }
  }, [userData, tweetVoice, tweetCountry, tweetEnglish]);

  useEffect(() => {
    console.log("postdata", postData);
  }, [postData]);

  const handleNavigate = (item) => {
    if (item.user.userId === userData.userId) {
      navigate("/profile");
    } else {
      navigate("/user-profile/" + item.user.userId);
    }
  };

  return (
    <div>
      <Transition.Root show={post} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={setPost}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-20 w-screen overflow-y-auto'>
            <div className='flex min-h-full justify-center p-2 text-center items-center sm:p-0 w-full'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-[560px]'>
                  <div className='flex justify-between p-[18px] pb-[12px] border-b-[1px] border-b-[#aaa]'>
                    <div className='flex items-center gap-2'>
                      <IoArrowBack className='text-[#EF9595] sm:text-[24px] text-[20px]' />
                      <h2 className='text-[20px] text-[#212121] font-light'>
                        Thread
                      </h2>
                    </div>
                    <button
                      onClick={() => setPost(false)}
                      className='text-[#EF9595] sm:text-[24px] text-[20px]'
                    >
                      <IoClose />
                    </button>
                  </div>
                  <div className='sm:p-[20px] p-[14px] border-b-[#c0bbbb] border-b-[1px]'>
                    <div className='flex items-start sm:gap-[20px] gap-[14px]'>
                      <img
                        onClick={() => handleNavigate(postData)}
                        src={postData?.user?.profilePic || Avtar}
                        alt='user'
                        className='sm:min-w-[50px] w-[40px] sm:h-[50px] h-[40px] rounded-full object-cover cursor-pointer'
                      />
                      <div>
                        <h2
                          className='text-[18px] font-semibold cursor-pointer'
                          onClick={() => handleNavigate(postData)}
                        >
                          {postData?.user?.displayName}
                        </h2>
                        <div className='flex gap-[6px] items-center flex-wrap'>
                          <p
                            className='text-[#5c5c5c] font-medium sm:text-[14px] text-[12px] cursor-pointer'
                            onClick={() => handleNavigate(postData)}
                          >
                            {postData?.user?.userName}
                          </p>
                          <div className='w-[4px] h-[4px] rounded-full bg-[#a1a1a1]' />
                          <p className='text-[12px] text-gray-500 whitespace-nowrap'>
                            {formatTimeDifference(postData?.createdAt)}
                          </p>
                        </div>
                        <p className='text-[#5c5c5c] text-[12px] mt-[10px]'>
                          {postData?.description}
                        </p>
                        <div className='flex sm:justify-start justify-end'>
                          {postData?.imagePath &&
                          /\.(jpg|jpeg|png|svg)(?=\?alt=media)/i.test(
                            postData.imagePath
                          ) ? (
                            <div
                              className='max-w-[300px] w-full h-[170px] rounded-[10px] mt-[12px]'
                              onClick={() => {
                                setImageViewer(!imageViewer);
                                setSinglePost(postData);
                                setPost(!post);
                              }}
                            >
                              <img
                                className='w-full h-full object-cover rounded-[10px]'
                                src={postData.imagePath}
                                alt='postImage'
                                onError={({ currentTarget }) => {
                                  currentTarget.src = NotFound;
                                  currentTarget.classList =
                                    "opacity-60 rounded-[10px]";
                                }}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className='flex gap-[24px] mt-[20px] flex-wrap'>
                          <button
                            className={`flex sm:gap-[16px] gap-[6px] text-[16px] items-center `}
                            onClick={() => handleLike(postData.id)}
                          >
                            {postData?.likeList?.includes(userData?.userId) ? (
                              <TiArrowUpThick className='sm:text-[24px] text-[20px] text-[green]' />
                            ) : (
                              <TiArrowUpOutline className='sm:text-[24px] text-[20px] text-[#5c5c5c]' />
                            )}
                            {postData?.likeList?.length || 0}
                          </button>
                          <button
                            // onClick={() => {
                            //   setTweet(true);
                            //   setPostId(postData?.id);
                            //   setPost(false);
                            // }}
                            className='flex sm:gap-[16px] gap-[6px] text-[16px] text-[#525151]'
                          >
                            <MdMessage className='sm:text-[24px] text-[20px] text-[#5c5c5c]' />
                            {postData?.commentCount || 0}
                          </button>

                          <button className='flex sm:gap-[16px] gap-[6px] text-[14px]'>
                            <HiEye className='sm:text-[24px] text-[20px] text-[#5c5c5c]' />
                            {postData?.viewsList?.length * 3}
                          </button>
                          <Menu
                            as='div'
                            className='relative inline-block text-left'
                          >
                            <div className='flex items-center'>
                              <Menu.Button className='text-[14px]'>
                                <IoMdShare className='sm:text-[24px] text-[20px] text-[#5c5c5c]' />
                              </Menu.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter='transition ease-out duration-100'
                              enterFrom='transform opacity-0 scale-95'
                              enterTo='transform opacity-100 scale-100'
                              leave='transition ease-in duration-75'
                              leaveFrom='transform opacity-100 scale-100'
                              leaveTo='transform opacity-0 scale-95'
                            >
                              <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                <div className='py-1'>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <CopyToClipboard
                                        text='https://aqurableek-5rhg.vercel.app/dashboard'
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
                                          <FaLink className='text-[18px]' />
                                          Share Link
                                        </div>
                                      </CopyToClipboard>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
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
      <ImageViewer
        imageViewer={imageViewer}
        setImageViewer={setImageViewer}
        postData={singlePost}
      />
    </div>
  );
}

export default SinglePost;
