import React, { useEffect, useState, Fragment } from "react";
import { MdFlag, MdMessage, MdVerified } from "react-icons/md";
import { TiArrowUpOutline } from "react-icons/ti";
import { IoMdShare } from "react-icons/io";
import { HiEye } from "react-icons/hi";
import CreateTweet from "../../components/Modals/CreateTweet";
import { getTodayDate } from "../../helper/uploadData";
import NotFound from "../../assets/Images/not-found.png";
import { updateLikeList } from "../../helper/fetchTweetData";
import { toast } from "react-toastify";
import ReplyTweet from "../../components/Modals/ReplyTweet";
import SinglePost from "../../components/Modals/SinglePost";
import { TiArrowUpThick } from "react-icons/ti";
import { Menu, Transition } from "@headlessui/react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa6";
import ImageViewer from "../../components/Modals/ImageViewer";
import { useNavigate } from "react-router-dom";
import { formatTimeDifference } from "../../helper/formateTiming";
import { useDispatch, useSelector } from "react-redux";
import {
  filterEnglishPostData,
  filterTweetCountryData,
  filterTweetVoiceData,
  latestTweetVoiceData,
  restPostByVoice,
} from "../../helper/filterTweetUtils";
import LoadingSkeleton from "../../components/loaadingSkeleton/loadingSkeleton";
import Avtar from "../../assets/Images/user.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard = () => {
  const [open, setOpen] = useState(false);
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
  const [filteredTweetVoice, setFilteredTweetVoice] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const tweetVoice = useSelector((state) => state.user.tweetVoice);
  const tweetCountry = useSelector((state) => state.user.tweetCountry);
  const tweetEnglish = useSelector((state) => state.user.englishPost);

  const fetchLatestData = async () => {
    if (tweetVoice && userData !== undefined) {
      const filteredData = await latestTweetVoiceData(tweetVoice, userData);

      setFilteredTweetVoice(filteredData);
      setUserId(userData.userId);
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, [tweetVoice, userData, dispatch]);

  const fetchAllData = async () => {
    if (filteredTweetVoice.length > 0) {
      try {
        // Initialize a set to keep track of unique identifiers
        let uniqueIds = new Set();

        // Function to filter out duplicates and update the set
        const filterAndAddUnique = (data) => {
          const nonNullData = data.flat().filter((item) => item !== null);
          const uniqueData = nonNullData.filter((item) => {
            if (!uniqueIds.has(item.id)) {
              uniqueIds.add(item.id);
              return true;
            }
            return false;
          });
          return uniqueData;
        };

        const firstBatch = [
          filteredTweetVoice[0],
          filterTweetVoiceData(tweetVoice, userData, 24),
          filterTweetCountryData(tweetCountry, userData, 24),
          filterEnglishPostData(tweetEnglish, userData, 24),
          filteredTweetVoice[1],
          filterTweetVoiceData(tweetVoice, userData, 48),
          filterTweetCountryData(tweetCountry, userData, 48),
          filterEnglishPostData(tweetEnglish, userData, 48),
          filteredTweetVoice[2],
          filterTweetVoiceData(tweetVoice, userData, 72),
          filterTweetCountryData(tweetCountry, userData, 72),
          filterEnglishPostData(tweetEnglish, userData, 72),
        ];

        let results = await Promise.all(firstBatch);
        let uniqueResults = filterAndAddUnique(results);
        setFilterData(uniqueResults);
        setLoading(false);

        // Process and set the second batch (3-7 days).
        const secondBatch = [
          filteredTweetVoice[3],
          filterTweetVoiceData(tweetVoice, userData, 168),
          filterTweetCountryData(tweetCountry, userData, 168),
          filterEnglishPostData(tweetEnglish, userData, 168),
          filteredTweetVoice[4],
          filterTweetVoiceData(tweetVoice, userData, 360),
          filterTweetCountryData(tweetCountry, userData, 360),
          filteredTweetVoice[5],
          filterTweetVoiceData(tweetVoice, userData, 720),
          filterTweetCountryData(tweetCountry, userData, 720),
          filterEnglishPostData(tweetEnglish, userData, 720),
        ];

        results = await Promise.all(secondBatch);
        uniqueResults = filterAndAddUnique(results);
        setFilterData((prev) => [...prev, ...uniqueResults]);

        // Process and set the third batch (rest post by voice).
        const thirdBatch = [restPostByVoice(tweetVoice, userData)];

        results = await Promise.all(thirdBatch);
        uniqueResults = filterAndAddUnique(results);
        setFilterData((prev) => removeDuplicates([...prev, ...uniqueResults]));
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }
  };

  function removeDuplicates(array) {
    return array.filter((item, index) => array.indexOf(item) === index);
  }

  useEffect(() => {
    fetchAllData();
  }, [filteredTweetVoice, tweetVoice, tweetCountry, tweetEnglish]);

  const hasPostedUser = async () => {
    const sevenDaysAgo = getTodayDate(168);
    const tweetVoiceData = tweetVoice;
    const sevenDaysData = Object.values(tweetVoiceData)?.filter(
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
    if (tweetVoice && userData) {
      hasPostedUser();
    }
  }, [tweetVoice]);

  const handleLike = async (postId) => {
    const data = await updateLikeList(postId, userData);
    setSinglePost(data);
  };

  const hanldeCheckUserPost = async () => {
    try {
      const twentyFourHoursAgo = getTodayDate(24);
      const tweetVoiceData = tweetVoice;

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
      <div className="side-space">
        <div className="p-[20px]">
          {loading ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : (
            <div
              className={
                canSeePost
                  ? "shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] 2xl:max-w-[1300px] 2xl:w-[60%] xl:w-[70%] lg:w-[80%] w-full sm:mx-auto relative"
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
                            src={item?.user?.profilePic || Avtar}
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
                                          <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=https://aqrableek.com/posts/${item.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={
                                              active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700"
                                            }
                                          >
                                            <div className="px-4 py-2 text-sm flex gap-2 cursor-pointer">
                                              <FaFacebook className="text-blue-600" />
                                              Share on Facebook
                                            </div>
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href={`https://twitter.com/intent/tweet?url=https://aqrableek.com/posts/${
                                              item.id
                                            }&text=${encodeURIComponent(
                                              item.description
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={
                                              active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700"
                                            }
                                          >
                                            <div className="px-4 py-2 text-sm flex gap-2 cursor-pointer">
                                              <FaTwitter className="text-blue-400" />
                                              Share on Twitter
                                            </div>
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href={`/post/${item.id}`}
                                            // href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                            //   "Check out this post! " +
                                            //     "https://aqrableek.com/posts/" +
                                            //     item.id
                                            // )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={
                                              active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700"
                                            }
                                          >
                                            <div className="px-4 py-2 text-sm flex gap-2 cursor-pointer">
                                              <FaWhatsapp className="text-green-600" />
                                              Share on WhatsApp
                                            </div>
                                          </a>
                                        )}
                                      </Menu.Item>
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
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
                    hanldeCheckUserPost();
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
        // fetchLatestData={fetchLatestData}
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
        setPostData={setSinglePost}
        handleLike={handleLike}
      />
    </div>
  );
};

export default Dashboard;
