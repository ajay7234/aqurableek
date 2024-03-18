import React, { useEffect, useState } from "react";
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
      // setLoading(true);
      const dataPromises = [
        latestPostByVoice(1),
        bestPostByVoice(24),
        bestPostByCountry(24),
        bestPostByEngLang(24),

        latestPostByVoice(2),
        bestPostByVoice(48),
        bestPostByCountry(48),
        bestPostByEngLang(48),

        latestPostByVoice(3),
        bestPostByVoice(72),
        bestPostByCountry(72),
        bestPostByEngLang(72),

        latestPostByVoice(5),
        bestPostByVoice(168),
        bestPostByCountry(168),
        bestPostByEngLang(168),

        latestPostByVoice(5),
        bestPostByVoice(360),
        bestPostByCountry(360),
        bestPostByEngLang(360),

        latestPostByVoice(6),
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
      console.log(uniqueResults);
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

  // useEffect(() => {}, [canSeePost]);

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
    const userData = await getUserData();
    const currentDate = getTodayDate(24);
    const tweetVoice = await voiceData();
    const lastDayData = Object.values(tweetVoice)?.filter(
      (postData) => postData.createdAt > currentDate
    );
    if (lastDayData) {
      const hasUserPosted = lastDayData.some(
        (post) => post.userId === userData.userId
      );
      if (hasUserPosted) {
        toast.error("You can only post once in 24 hours");
      } else {
        setOpen(true);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

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
                      className="sm:p-[20px] p-[8px] border-b-[#c0bbbb] border-b-[1px]"
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

                          <p className="text-[#5c5c5c] text-[12px] mt-[10px] break-words">
                            {item?.description}
                          </p>
                          <div className="flex sm:justify-start justify-end">
                            {item?.imagePath ? (
                              <div className="max-w-[300px] w-full h-[170px] rounded-[10px] mt-[12px]">
                                <img
                                  className="w-full h-full object-cover rounded-[10px]"
                                  src={item?.imagePath}
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
                              <TiArrowUpOutline
                                className={`text-[24px] ${
                                  item?.likeList?.includes(userId)
                                    ? "text-[green]"
                                    : "text-[#5c5c5c]"
                                }`}
                              />
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
                              {item?.viewsList?.length}
                            </button>
                            <button className="text-[14px]">
                              <IoMdShare className="text-[24px] text-[#5c5c5c]" />
                            </button>
                          </div>
                        </div>
                      </div>
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
