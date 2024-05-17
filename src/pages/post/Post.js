import React, { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Avtar from "../../assets/Images/user.png";
import { MdMessage } from "react-icons/md";
import { HiEye } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";
import { IoMdShare } from "react-icons/io";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaLink } from "react-icons/fa6";
import { TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti";
import { formatTimeDifference } from "../../helper/formateTiming";
import NotFound from "../../assets/Images/not-found.png";
import { updateLikeList } from "../../helper/fetchTweetData";
import ImageViewer from "../../components/Modals/ImageViewer";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Post() {
  const params = useParams();
  const [postData, setPostData] = useState();
  const userData = useSelector((state) => state.user.data?.userData);
  const tweetVoice = useSelector((state) => state.user.tweetVoice);
  const tweetCountry = useSelector((state) => state.user.tweetCountry);
  const tweetEnglish = useSelector((state) => state.user.englishPost);
  const navigate = useNavigate();
  const [singlePost, setSinglePost] = useState({});
  const [imageViewer, setImageViewer] = useState(false);
  const [post, setPost] = useState(false);

  useEffect(() => {
    if (userData) {
      const tweetVoiceData = tweetVoice[`${params.id}`];
      const tweetCountryData = tweetCountry[`${params.id}`];
      const englishPostData = tweetEnglish[`${params.id}`];

      if (tweetVoiceData) {
        setPostData(tweetVoiceData);
      } else if (tweetCountryData) {
        setPostData(tweetCountryData);
      } else if (englishPostData) {
        setPostData(englishPostData);
      }
    }

    if (postData) {
      axios
        .post(`/post/${params.id}`, postData)
        .then((response) => {
          console.log("respo", response);
          console.log("Post data sent successfully");
        })
        .catch((error) => {
          console.error("Error sending post data:", error);
        });
    }
    console.log("postData", postData);
  }, [userData, tweetVoice, tweetCountry, tweetEnglish, postData]);

  const handleNavigate = (item) => {
    if (item.user.userId === userData.userId) {
      navigate("/profile");
    } else {
      navigate("/user-profile/" + item.user.userId);
    }
  };

  const handleLike = async (postId) => {
    const data = await updateLikeList(postId, userData);
    setPostData(data);
  };

  return (
    <div>
      {postData && (
        <Helmet>
          <link
            rel="canonical"
            href={`https://aqurableek-5rhg.vercel.app/post/${params.id}`}
          />
          <link rel="og:image" href={postData?.user?.profilePic} />
          <meta name="description" content={postData.description} />
          <meta
            property="og:url"
            content={`https://aqurableek-5rhg.vercel.app/post/${params.id}`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={postData.title} />
          <meta property="og:description" content={postData.description} />
          <meta
            property="og:image"
            content="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq7BgpG1CwOveQ_gEFgOJASWjgzHAgVfyozkIXk67LzN1jnj9I&s"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:domain"
            content="aqurableek-5rhg.vercel.app"
          />
          <meta
            property="twitter:url"
            content={`https://aqurableek-5rhg.vercel.app/post/${params.id}`}
          />
          <meta name="twitter:title" content={postData.title} />
          <meta name="twitter:description" content={postData.description} />
          <meta name="twitter:image" content={postData?.user?.profilePic} />
        </Helmet>
      )}

      <div className="side-space">
        <div className="shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] 2xl:max-w-[1300px] 2xl:w-[60%] xl:w-[70%] lg:w-[80%] w-full sm:mx-auto relative mt-[100px]">
          <div className="sm:p-[20px] p-[14px]">
            {!postData ? (
              <div className="flex items-start sm:gap-[20px] gap-[14px] animate-pulse">
                <div>
                  <div className="sm:min-w-[160px] w-[100px] sm:h-[160px] h-[100px] rounded-sm bg-gray-300 cursor-pointer"></div>
                  <div className="mt-[20px]">
                    <div className="flex flex-col justify-center gap-[6px] items-center flex-wrap">
                      <div className="w-[80px] h-[16px] bg-gray-300 mb-[6px]"></div>
                      <div className="w-[60px] h-[12px] bg-gray-300 cursor-pointer"></div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full h-[18px] bg-gray-300 mb-[10px]"></div>
                  <div className="w-full h-[18px] bg-gray-300 mb-[10px]"></div>
                  <div className="w-1/2 h-[18px] bg-gray-300 mb-[10px]"></div>
                  {/* <div className="flex sm:justify-start justify-end">
                  <div className="w-[300px] h-[170px] rounded-[10px] bg-gray-300 cursor-pointer"></div>
                </div> */}
                  <div className="flex gap-[24px] mt-[20px] flex-wrap">
                    <div className="flex gap-[6px] items-center">
                      <div className="w-[20px] h-[20px] bg-gray-300"></div>
                      <div className="w-[40px] h-[16px] bg-gray-300"></div>
                    </div>
                    <div className="flex gap-[6px] items-center">
                      <div className="w-[20px] h-[20px] bg-gray-300"></div>
                      <div className="w-[40px] h-[16px] bg-gray-300"></div>
                    </div>
                    <div className="flex gap-[6px] items-center">
                      <div className="w-[20px] h-[20px] bg-gray-300"></div>
                      <div className="w-[40px] h-[16px] bg-gray-300"></div>
                    </div>
                    <div className="relative inline-block text-left">
                      <div className="flex items-center">
                        <div className="w-[20px] h-[20px] bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start sm:gap-[20px] gap-[14px]">
                <div>
                  <img
                    onClick={() => handleNavigate(postData)}
                    src={postData?.user?.profilePic || Avtar}
                    alt="user"
                    className="sm:min-w-[160px] w-[100px] sm:h-[160px] h-[100px] rounded-sm object-cover cursor-pointer"
                  />
                  <div className="mt-[20px]">
                    <h2
                      className="text-[20px] font-semibold cursor-pointer capitalize text-center"
                      onClick={() => handleNavigate(postData)}
                    >
                      {postData?.user?.displayName}
                    </h2>
                    <div className="flex  justify-center gap-[6px] items-center flex-wrap">
                      <p
                        className="text-[#5c5c5c] font-medium sm:text-[14px] text-[12px] cursor-pointer"
                        onClick={() => handleNavigate(postData)}
                      >
                        {postData?.user?.userName}
                      </p>
                      <div className="w-[4px] h-[4px] rounded-full bg-[#a1a1a1]" />
                      <p className="text-[12px] text-gray-500 whitespace-nowrap">
                        {formatTimeDifference(postData?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-[#5c5c5c] text-[18px] mt-[10px]">
                    {postData?.description}
                  </p>
                  <div className="flex sm:justify-start justify-end">
                    {postData?.imagePath &&
                    /\.(jpg|jpeg|png|svg)(?=\?alt=media)/i.test(
                      postData.imagePath
                    ) ? (
                      <div
                        className="max-w-[300px] w-full h-[170px] rounded-[10px] mt-[12px]"
                        onClick={() => {
                          setImageViewer(!imageViewer);
                          setSinglePost(postData);
                          setPost(!post);
                        }}
                      >
                        <img
                          className="w-full h-full object-cover rounded-[10px]"
                          src={postData.imagePath}
                          alt="postImage"
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
                  <div className="flex gap-[24px] mt-[20px] flex-wrap">
                    <button
                      className={`flex sm:gap-[16px] gap-[6px] text-[16px] items-center `}
                      onClick={() => handleLike(params.id)}
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
                      //   setPost(false);
                      // }}
                      className="flex sm:gap-[16px] gap-[6px] text-[16px] text-[#525151]"
                    >
                      <MdMessage className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                      {postData?.commentCount || 0}
                    </button>

                    <button className="flex sm:gap-[16px] gap-[6px] text-[14px]">
                      <HiEye className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                      {postData?.viewsList?.length * 3 || 0}
                    </button>
                    <Menu as="div" className="relative inline-block text-left">
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
                                  text="https://aqrableek.com"
                                  // onCopy={handleCopySuccess}
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageViewer
        imageViewer={imageViewer}
        setImageViewer={setImageViewer}
        postData={singlePost}
        setPostData={setSinglePost}
        handleLike={handleLike}
      />
    </div>
  );
}

export default Post;
