import React, { useEffect, useState, Fragment } from "react";
import { MdFlag, MdMessage } from "react-icons/md";
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
import { getUserData } from "../../helper/userProfileData";
import ReplyTweet from "../../components/Modals/ReplyTweet";
import SinglePost from "../../components/Modals/SinglePost";
import { TiArrowUpThick } from "react-icons/ti";
import { Menu, Transition } from "@headlessui/react";
import { FaLink } from "react-icons/fa6";
import CopyToClipboard from "react-copy-to-clipboard";
import moment from "moment";

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

  const fetchAllData = async () => {
    try {
      const dataPromises = [
        latestPostByVoice(0),
        bestPostByVoice(24),
        bestPostByCountry(24),
        bestPostByEngLang(24),

        // 2 days
        latestPostByVoice(1),
        bestPostByVoice(48),
        bestPostByCountry(48),
        bestPostByEngLang(48),
        // 3 days

        latestPostByVoice(2),
        bestPostByVoice(72),
        bestPostByCountry(72),
        bestPostByEngLang(72),
        // 7 days

        latestPostByVoice(3),
        bestPostByVoice(168),
        bestPostByCountry(168),
        bestPostByEngLang(168),

        // 15 days
        latestPostByVoice(4),
        bestPostByVoice(360),
        bestPostByCountry(360),
        bestPostByEngLang(360),

        // 30 days
        latestPostByVoice(5),
        bestPostByVoice(720),
        bestPostByCountry(720),
        bestPostByEngLang(720),

        restPostByVoice(),
      ];
      const results = await Promise.all(dataPromises);

      const nonNullResults = results.flat().filter((item) => item !== null);
      const uniqueResults = Array.from(
        new Map(
          nonNullResults.map((item) => {
            const uniqueKey = `${item?.createdAt}-${item?.user?.userName}-${item?.description}`;
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
    const userData = await getUserData();
    setUserId(userData?.userId);
  };

  const hasPostedUser = async () => {
    const sevenDaysAgo = getTodayDate(168);
    const userData = await getUserData();
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

    setFilterData((currentData) =>
      currentData.map((post) => {
        if (post?.id === postId) {
          const isLiked = post.likeList?.includes(userId);
          return {
            ...post,
            likeCount: isLiked ? post?.likeCount - 1 : post?.likeCount + 1,
            likeList: isLiked
              ? post?.likeList?.filter((id) => id !== userId)
              : [...(post?.likeList || []), userId],
          };
        }
        return post;
      })
    );
  };

  const hanldeCheckUserPost = async () => {
    try {
      const userData = await getUserData();
      const twentyFourHoursAgo = getTodayDate(24);
      const tweetVoiceData = await voiceData();

      const postsInLast24Hours = Object.values(tweetVoiceData)?.filter(
        (postData) =>
          new Date(postData.createdAt) > new Date(twentyFourHoursAgo)
      );

      const hasUserPosted = postsInLast24Hours.some(
        (post) => post.userId === userData.userId
      );

      if (hasUserPosted) {
        toast.error("You can only post once in 24 hours");
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopySuccess = () => {
    toast.success("Link copied to clipboard!");
  };

  const formatTimeDifference = (createdAt, name) => {
    const postDate = moment.utc(createdAt);
    const currentDate = moment.utc();

    const duration = moment.duration(currentDate.diff(postDate));

    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) % 24;
    const minutes = Math.floor(duration.asMinutes()) % 60;
    const seconds = Math.floor(duration.asSeconds()) % 60;

    if (days >= 1) {
      if (days === 1) {
        return "1 day ago";
      } else if (days <= 2) {
        return `${days} days ago`;
      } else if (days <= 365) {
        return postDate.format("MMMM DD");
      } else {
        return postDate.format("MMMM DD YYYY");
      }
    } else if (hours >= 1) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes >= 1) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    }
  };

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={!sidebarOpen ? "lg:pl-72" : ""}>
        <div className="p-[20px]">
          {loading ? (
            <>
              <div className=" h-[calc(100vh-104px)] flex justify-center items-center">
                <div className="box">
                  <div className="loader-13"></div>
                </div>
              </div>
            </>
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
                      className="sm:p-[20px] p-[8px] border-b-[#c0bbbb] border-b-[1px] flex items-start"
                      key={i}
                    >
                      <div className="flex items-start sm:gap-[20px] gap-[12px] w-full">
                        <button
                          onClick={() => {
                            setPost(true);
                            setSinglePost(item);
                          }}
                        >
                          <img
                            src={item?.user?.profilePic || user}
                            alt="user"
                            className="sm:w-[50px] sm:min-w-[50px] w-[30px] min-w-[30px] sm:h-[50px] h-[30px] rounded-full object-cover"
                          />
                        </button>
                        <div className="w-full">
                          <h2 className="text-[18px] font-semibold">
                            {item?.user?.displayName}
                          </h2>
                          <p className="text-[#5c5c5c] font-medium text-[14px]">
                            {item?.user?.userName}
                          </p>

                          <p className="text-[#5c5c5c] text-[12px] mt-[10px] break-all">
                            {item?.description}
                          </p>
                          <div className="flex sm:justify-start justify-end">
                            {item?.imagePath &&
                            /\.(jpg|jpeg|png|svg)(?=\?alt=media)/i.test(
                              item.imagePath
                            ) ? (
                              <div className="max-w-[300px] w-full h-[170px] rounded-[10px] mt-[12px]">
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

                          <div className="flex gap-[24px] mt-[20px] flex-wrap">
                            <button
                              className={`flex gap-[16px] text-[14px] `}
                              onClick={() => handleLike(item?.id)}
                            >
                              {item?.likeList?.includes(userId) ? (
                                <TiArrowUpThick className="text-[24px] text-[green]" />
                              ) : (
                                <TiArrowUpOutline className="text-[24px] text-[#5c5c5c]" />
                              )}
                              {item?.likeList?.length}
                            </button>
                            <button
                              onClick={() => {
                                setTweet(true);
                                setPostId(item?.id);
                              }}
                              className="flex gap-[16px] text-[14px]"
                            >
                              <MdMessage className="text-[24px] text-[#5c5c5c]" />
                              {item?.commentCount}
                            </button>

                            <button className="flex gap-[16px] text-[14px]">
                              <HiEye className="text-[24px] text-[#5c5c5c]" />
                              {item?.viewsList && item?.viewsList?.length * 3}
                            </button>
                            {/* <button className="text-[14px]">
                              <IoMdShare className="text-[24px] text-[#5c5c5c]" />
                            </button> */}
                            <Menu
                              as="div"
                              className="relative inline-block text-left"
                            >
                              <div>
                                <Menu.Button className="text-[14px]">
                                  <IoMdShare className="text-[24px] text-[#5c5c5c]" />
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
                                          text="https://aqurableek.vercel.app/dashboard"
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
                      <p className="text-[12px] text-gray-500 whitespace-nowrap">
                        {formatTimeDifference(
                          item?.createdAt,
                          item?.user?.displayName
                        )}
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
                    hanldeCheckUserPost();
                  }}
                  className="bg-[#EF9595] text-[#212121] w-[50px] h-[50px] rounded-md flex justify-center items-center"
                >
                  <MdFlag className="text-[30px]" />
                </button>
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
