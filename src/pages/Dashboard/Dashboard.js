import React, { useEffect, useState, Fragment } from "react";
import { MdFlag, MdMessage, MdVerified } from "react-icons/md";
import { TiArrowUpOutline } from "react-icons/ti";
import { IoMdShare } from "react-icons/io";
import { HiEye } from "react-icons/hi";
import Sidebar from "../../components/Sidebar/Sidebar";
import CreateTweet from "../../components/Modals/CreateTweet";
import {
  bestPostByCountry,
  bestPostByEngLang,
  bestPostByVoice,
  getTodayDate,
  latestPostByVoice,
  restPostByVoice,
} from "../../helper/filterTweetData";
import user from "../../assets/Images/user.png";
import NotFound from "../../assets/Images/not-found.png";
import { updateLikeList, voiceData } from "../../helper/fetchTweetData";
import { toast } from "react-toastify";
import { getCurrentUserData } from "../../helper/userProfileData";
import ReplyTweet from "../../components/Modals/ReplyTweet";
import SinglePost from "../../components/Modals/SinglePost";
import { TiArrowUpThick } from "react-icons/ti";
import { Menu, Transition } from "@headlessui/react";
import { FaLink } from "react-icons/fa6";
import CopyToClipboard from "react-copy-to-clipboard";
import ImageViewer from "../../components/Modals/ImageViewer";
import { useNavigate } from "react-router-dom";
import { formatTimeDifference } from "../../helper/formateTiming";
import Loader from "../../components/Loader/Loader";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [userId, setUserId] = useState();
  const [canSeePost, setCanSeePost] = useState(false);
  const [tweet, setTweet] = useState(false);
  const [postId, setPostId] = useState("");
  const [post, setPost] = useState(false);
  const [singlePost, setSinglePost] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageViewer, setImageViewer] = useState(false);
  const [canUploadPost, setCanUploadPost] = useState(false);
  const [loadSidebar, setLoadSidebar] = useState(false);
  const [latestPost, setLatestPost] = useState([]);

  const navigate = useNavigate();
  const bestPostByVoice1 = bestPostByVoice();
  const bestPostByCountry1 = bestPostByCountry();
  // const latestPostByVoice1 = latestPostByVoice()

  const fetchAllData = async () => {
    const latestPosts = [];

    for (let i = 0; i <= 5; i++) {
      const latestPost = await latestPostByVoice();
      latestPosts.push(latestPost[i]);
    }

    try {
      const dataPromises = [
        latestPosts[0],
        bestPostByVoice1(24),
        bestPostByCountry1(24),
        bestPostByEngLang(24),

        // 2 days
        latestPosts[1],
        bestPostByVoice1(48),
        bestPostByCountry1(48),
        bestPostByEngLang(48),
        // 3 days

        latestPosts[2],
        bestPostByVoice1(72),
        bestPostByCountry1(72),
        bestPostByEngLang(72),
        // 7 days

        latestPosts[3],
        bestPostByVoice1(168),
        bestPostByCountry1(168),
        bestPostByEngLang(168),

        // 15 days
        latestPosts[4],
        bestPostByVoice1(360),
        bestPostByCountry1(360),
        bestPostByEngLang(360),

        // 30 days
        latestPosts[5],
        bestPostByVoice1(720),
        bestPostByCountry1(720),
        bestPostByEngLang(720),

        restPostByVoice(),
      ];
      const results = await Promise.all(dataPromises);

      const nonNullResults = results.flat().filter((item) => item !== null);

      const uniqueResults = Array.from(
        new Map(
          nonNullResults.map((item) => {
            const uniqueKey = `${item?.id}-${item?.user?.userName}-${item?.description}`;
            return [uniqueKey, item];
          })
        ).values()
      );
      setFilterData(uniqueResults);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [open, tweet, post]);

  useEffect(() => {
    getUserID();
  }, []);

  const getUserID = async () => {
    const userData = await getCurrentUserData();
    setUserId(userData?.userId);
  };

  const hasPostedUser = async () => {
    const sevenDaysAgo = getTodayDate(168);
    const userData = await getCurrentUserData();
    const tweetVoice = await voiceData();
    const sevenDaysData = Object.values(tweetVoice)?.filter(
      (postData) => postData.createdAt > sevenDaysAgo
    );
    if (sevenDaysData) {
      const hasUserPosted = sevenDaysData.some(
        (post) => post.userId === userData.userId
      );

      if (hasUserPosted) {
        setCanSeePost(true);
      } else {
        setShowMessage(true);
      }
    }
  };

  useEffect(() => {
    if (filterData) {
      hasPostedUser();
    }
  }, [filterData, canSeePost]);

  const handleLike = async (postId) => {
    await updateLikeList(postId);

    let updatedSinglePost = {};

    const updatedData = filterData.map((post) => {
      if (post?.id === postId) {
        const isLiked = post.likeList?.includes(userId);
        const updatedPost = {
          ...post,
          likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
          likeList: isLiked
            ? post.likeList.filter((id) => id !== userId)
            : [...(post.likeList || []), userId],
        };

        updatedSinglePost = updatedPost;
        setSinglePost(updatedPost);

        return updatedPost;
      }
      return post;
    });

    setFilterData(updatedData);
  };

  useEffect(() => {
    hanldeCheckUserPost();
  }, []);

  const hanldeCheckUserPost = async () => {
    try {
      const userData = await getCurrentUserData();
      const twentyFourHoursAgo = getTodayDate(24);
      const tweetVoiceData = await voiceData();

      const postsInLast24Hours = Object.values(tweetVoiceData)?.filter(
        (postData) =>
          new Date(postData.createdAt) > new Date(twentyFourHoursAgo)
      );

      const hasUserPosted = postsInLast24Hours.some(
        (post) => post.userId === userData.userId
      );
      setCanUploadPost(hasUserPosted);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleCheckPost = () => {
    if (canUploadPost) {
      toast.error("You can only post once in 24 hours");
    } else {
      setOpen(true);
    }
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowMessage(true);
  //   }, 7000);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleCopySuccess = () => {
    toast.success("Link copied to clipboard!");
  };

  const handleNavigate = (item) => {
    if (item.user.userId === userId) {
      navigate("/profile");
    } else {
      navigate("/user-profile/" + item.user.userId);
    }
  };

  return (
    <div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        loadSidebar={loadSidebar}
      />
      <div className={!sidebarOpen ? "lg:pl-72" : ""}>
        <div className="p-[20px]">
          {loading ? (
            <Loader />
          ) : (
            <div
              className={
                canSeePost
                  ? "shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] 2xl:max-w-[1300px] 2xl:w-[60%] xl:w-[70%] w-full sm:mx-auto relative"
                  : "h-[calc(100vh-104px)] flex justify-center items-center"
              }
            >
              {canSeePost &&
                filterData?.map((item, i) => {
                  return (
                    <div
                      className="sm:p-[20px] p-[8px] border-b-[#c0bbbb] border-b-[1px] flex sm:flex-nowrap flex-wrap items-start"
                      key={i}
                    >
                      <div className="flex items-start sm:gap-[20px] gap-[12px] w-full">
                        <div onClick={() => handleNavigate(item)}>
                          <img
                            src={item?.user?.profilePic || user}
                            alt="user"
                            className="sm:w-[50px] sm:min-w-[50px] w-[30px] min-w-[30px] sm:h-[50px] h-[30px] rounded-full object-cover"
                          />
                        </div>
                        <div className="w-full">
                          <div className="flex items-center gap-1">
                            <h2
                              className="sm:text-[18px] text-[16px] font-semibold cursor-pointer"
                              onClick={() => handleNavigate(item)}
                            >
                              {item?.user?.displayName}
                            </h2>
                            {item?.user?.isVerified && (
                              <MdVerified className="text-[#ff6d51] text-[14px]" />
                            )}
                          </div>
                          <div className="flex gap-[6px] items-center flex-wrap">
                            <p
                              onClick={() => handleNavigate(item)}
                              className="text-[#5c5c5c] font-medium sm:text-[14px] text-[12px] cursor-pointer"
                            >
                              {item?.user?.userName}
                            </p>
                            <div className="w-[4px] h-[4px] rounded-full bg-[#a1a1a1] sm:hidden block" />
                            <p className="text-[12px] text-gray-500 whitespace-nowrap sm:hidden block">
                              {formatTimeDifference(item?.createdAt)}
                            </p>
                          </div>

                          <p
                            className="text-[#5c5c5c] sm:text-[16px] text-[14px] mt-[10px] break-all cursor-pointer"
                            onClick={() => {
                              setPost(true);
                              setSinglePost(item);
                            }}
                          >
                            {item?.description}
                          </p>
                          <div className="flex sm:justify-start justify-end">
                            {item?.imagePath &&
                            /\.(jpg|jpeg|png|svg)(?=\?alt=media)/i.test(
                              item.imagePath
                            ) ? (
                              <div
                                className="max-w-[300px] w-full h-[170px] rounded-[10px] mt-[12px]"
                                onClick={() => {
                                  setImageViewer(!imageViewer);
                                  setSinglePost(item);
                                }}
                              >
                                <img
                                  className="w-full h-full object-cover rounded-[10px]"
                                  src={item.imagePath}
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

                          <div className="flex items-center gap-[24px] mt-[20px] flex-wrap">
                            <button
                              className={`flex sm:gap-[16px] gap-[6px] sm:text-[16px] text-[14px] items-center `}
                              onClick={() => handleLike(item?.id)}
                            >
                              {item?.likeList?.includes(userId) ? (
                                <TiArrowUpThick className="sm:text-[24px] text-[20px] text-[green]" />
                              ) : (
                                <TiArrowUpOutline className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                              )}
                              {item?.likeList?.length || 0}
                            </button>
                            <button
                              // onClick={() => {
                              //   setTweet(true);
                              //   setPostId(item?.id);
                              // }}
                              className="flex sm:gap-[16px] gap-[6px] sm:text-[16px] text-[14px] items-center"
                            >
                              <MdMessage className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                              {item?.commentCount || 0}
                            </button>

                            <button className="flex sm:gap-[16px] gap-[6px] sm:text-[16px] text-[14px] items-center">
                              <HiEye className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                              {item?.viewsList && item?.viewsList?.length * 3}
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
                          </div>
                        </div>
                      </div>
                      <p className="text-[12px] text-gray-500 whitespace-nowrap sm:mt-0 mt-2 sm:block hidden">
                        {formatTimeDifference(item?.createdAt)}
                      </p>
                    </div>
                  );
                })}

              {!canSeePost && showMessage && (
                <div className="max-w-[600px] mx-auto bg-[#f0f0f0] rounded-[8px] flex justify-center items-center">
                  <h4 className="p-[18px] text-center">
                    You can not see posts because you hasn't posted in the last
                    7 days
                  </h4>
                </div>
              )}
              <div className="fixed right-[30px] bottom-[30px]">
                <button
                  onClick={() => {
                    handleCheckPost();
                  }}
                  className="bg-[#EF9595] text-[#212121] w-[50px] h-[50px] rounded-md flex justify-center items-center"
                >
                  <MdFlag className="text-[30px]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateTweet
        open={open}
        setOpen={setOpen}
        showCloseBtn={true}
        userId={userId}
        isSignup={false}
      />
      <ReplyTweet tweet={tweet} setTweet={setTweet} postId={postId} />
      <SinglePost
        post={post}
        setPost={setPost}
        postData={singlePost}
        setPostData={setSinglePost}
        handleLike={handleLike}
      />
      <ImageViewer
        imageViewer={imageViewer}
        setImageViewer={setImageViewer}
        postData={singlePost}
        handleLike={handleLike}
      />
    </div>
  );
};

export default Dashboard;
