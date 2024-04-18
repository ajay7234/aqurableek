import React, { Fragment, useEffect, useState } from "react";
import bgImg from "../../assets/Images/bg-img.jpg";
import { MdMessage, MdVerified } from "react-icons/md";
import { BsCalendar3 } from "react-icons/bs";
import { getUserProfileData } from "../../helper/userProfileData";
import moment from "moment";
import { FaLink } from "react-icons/fa6";
import { HiEye } from "react-icons/hi";
import { TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti";
import { useParams } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { IoMdShare } from "react-icons/io";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import NotFound from "../../assets/Images/not-found.png";
import { updateLikeList } from "../../helper/fetchTweetData";
import ImageViewer from "../../components/Modals/ImageViewer";
import ReplyTweet from "../../components/Modals/ReplyTweet";
import SinglePost from "../../components/Modals/SinglePost";
import Followers from "../../components/Modals/Followers";
import Following from "../../components/Modals/Following";
import {
  findFollowerList,
  findFollowingList,
  toggleFollowUser,
} from "../../helper/userFollowList";
import { formatTimeDifference } from "../../helper/formateTiming";
import Loader from "../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import Avtar from "../../assets/Images/user.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [postData, setPostData] = useState([]);
  const [imageViewer, setImageViewer] = useState(false);
  const [singlePost, setSinglePost] = useState({});
  const [tweet, setTweet] = useState(false);
  const [postId, setPostId] = useState("");
  const [post, setPost] = useState(false);
  const [followers, setFollowers] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user.userData);
  const AllUsersData = useSelector((state) => state.user.AllUsersData);
  const tweetVoice = useSelector((state) => state.user.tweetVoice);
  const tweetCountry = useSelector((state) => state.user.tweetCountry);
  const tweetEnglish = useSelector((state) => state.user.englishPost);
  const [currentUser, setCurrentUser] = useState({});

  const dispatch = useDispatch();

  const params = useParams();

  const getUserProfile = async () => {
    const userProfile = AllUsersData[params.id];

    const tweetVoicePosts = Object.entries(tweetVoice).map(
      ([postId, postData]) => ({
        id: postId,
        ...postData,
      })
    );

    const userPosts = tweetVoicePosts.filter(
      (post) => post.userId === params.id
    );
    console.log("userpost", userPosts);
    setUserData(userProfile);
    setPostData(userPosts.reverse());

    setIsLoading(false);
  };

  const handleCopySuccess = () => {
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    if (!user) {
    } else if (user) {
      setCurrentUser(user);
    }
  }, [user, dispatch, currentUser]);

  useEffect(() => {
    getUserProfile();
  }, [AllUsersData, currentUser, tweetVoice, tweetCountry, tweetEnglish]);

  const handleLike = async (postId) => {
    const data = await updateLikeList(postId, currentUser);
    setSinglePost(data);
    //getUserProfile();
  };

  const fetchFollowersList = async () => {
    const followerData = await findFollowerList(userData.followerList);
    setFollowerUsers(followerData);

    const followingData = await findFollowingList(userData.followingList);
    setFollowingUsers(followingData);
  };

  useEffect(() => {
    fetchFollowersList();
  }, [userData]);

  const handleUpdateFollowList = async () => {
    await toggleFollowUser(currentUser.userId, userData.userId);
  };

  return (
    <div>
      <div className='side-space'>
        {!isLoading ? (
          <div className='max-w-[1000px] mx-auto p-[20px]'>
            <div className='shadow-[rgba(0,0,0,0.2)_0px_1px_10px]'>
              <div className='relative'>
                <img
                  src={userData.bannerImage || bgImg}
                  alt='bg-img'
                  className='md:h-[250px] h-[150px] w-full object-cover'
                />
                <div className='absolute bottom-[-60px] left-[10px] z-[1] border-[#fff] border-[5px] rounded-full'>
                  <img
                    className='sm:w-[100px] w-[80px] sm:h-[100px] h-[80px] object-cover rounded-full'
                    src={userData.profilePic || Avtar}
                    alt='Your Company'
                  />
                </div>
              </div>
              <div>
                <div className='flex justify-end items-center py-[20px] gap-[10px] px-[20px] pb-0'>
                  {userData?.followerList?.includes(currentUser.userId) ? (
                    <button
                      className='bg-[#ef9595]  text-[#fff] rounded-[6px] font-semibold p-[4px_14px]'
                      onClick={() => handleUpdateFollowList()}
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      className='border-[#ef9595] text-[#ef9595] border-[1.5px] rounded-[6px] font-semibold p-[4px_14px]'
                      onClick={() => handleUpdateFollowList()}
                    >
                      Follow
                    </button>
                  )}
                </div>
                <div>
                  <div className='px-[20px] pb-3'>
                    <div className='mt-[12px]'>
                      <div className='flex items-center gap-1'>
                        <p className='text-[18px] font-bold'>
                          {userData.displayName}
                        </p>
                        {userData.isVerified && (
                          <MdVerified className='text-[#ff6d51] text-[14px]' />
                        )}
                      </div>
                      <p className=' text-[14px]'>{userData.userName}</p>
                    </div>
                    <p className='text-[#626161] text-[14px] my-[14px]'>
                      {userData.bio || ""}
                    </p>
                    <div className='flex items-center gap-[12px]'>
                      <BsCalendar3 className='text-[#626161] text-[14px]' />
                      <p className='text-[#626161] text-[14px]'>
                        Joined {moment(userData?.createdAt).format("MMMM YYYY")}
                      </p>
                    </div>
                    <div className='flex gap-[30px] mt-2 ]'>
                      <div className='flex gap-2'>
                        <h2>{userData.followers || 0}</h2>
                        <button
                          onClick={() => setFollowers(!followers)}
                          className='text-[#626161]'
                        >
                          Follwers
                        </button>
                      </div>
                      <div className='flex gap-2'>
                        <h2>{userData.following || 0}</h2>
                        <button
                          onClick={() => setFollowing(!following)}
                          className='text-[#626161]'
                        >
                          Following
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {postData.length > 0 && (
              <div className='shadow-[rgba(0,0,0,0.2)_0px_1px_10px] mt-[30px] bg-[#fff]'>
                <div className='border-b-[#aaa] border-b-[1px] py-[14px] flex justify-center items-center'>
                  <button className='bg-[#ef9595] text-[#fff] rounded-[6px] font-semibold p-[8px_20px]'>
                    Posts
                  </button>
                </div>
                {postData?.map((item, i) => {
                  return (
                    <div
                      className='sm:p-[20px] p-[8px] border-b-[#c0bbbb] border-b-[1px] flex sm:flex-nowrap flex-wrap items-start'
                      key={i}
                    >
                      <div className='flex items-start sm:gap-[20px] gap-[12px] w-full'>
                        <img
                          src={userData?.profilePic || Avtar}
                          alt='user'
                          className='sm:w-[50px] sm:min-w-[50px] w-[30px] min-w-[30px] sm:h-[50px] h-[30px] rounded-full object-cover'
                        />
                        <div className='w-full'>
                          <div className='flex items-center gap-1'>
                            <h2 className='sm:text-[18px] text-[16px] font-semibold'>
                              {userData.displayName}
                            </h2>
                            {item?.user?.isVerified && (
                              <MdVerified className='text-[#ff6d51] text-[14px]' />
                            )}
                          </div>
                          <div className='flex gap-[6px] items-center flex-wrap'>
                            <p className='text-[#5c5c5c] font-medium sm:text-[14px] text-[12px]'>
                              {userData.userName}
                            </p>
                            <div className='w-[4px] h-[4px] rounded-full bg-[#a1a1a1] sm:hidden block' />
                            <p className='text-[12px] text-gray-500 whitespace-nowrap sm:hidden block'>
                              {formatTimeDifference(item?.createdAt)}
                            </p>
                          </div>

                          <p
                            className='text-[#5c5c5c] sm:text-[16px] text-[14px] mt-[10px] break-all cursor-pointer'
                            onClick={() => {
                              setPost(true);
                              setSinglePost(item);
                            }}
                          >
                            {item?.description}
                          </p>
                          <div className='flex sm:justify-start justify-end'>
                            {item?.imagePath &&
                            /\.(jpg|jpeg|png|svg)(?=\?alt=media)/i.test(
                              item?.imagePath
                            ) ? (
                              <div
                                className='max-w-[300px] w-full h-[170px] rounded-[10px] mt-[12px]'
                                onClick={() => {
                                  setImageViewer(!imageViewer);
                                  setSinglePost(item);
                                  setPost(false);
                                }}
                              >
                                <img
                                  className='w-full h-full object-cover rounded-[10px]'
                                  src={item?.imagePath}
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

                          <div className='flex items-center gap-[24px] mt-[20px] flex-wrap'>
                            <button
                              className={`flex sm:gap-[16px] gap-[6px] text-[16px] items-center `}
                              onClick={() => handleLike(item.id)}
                            >
                              {item.likeList?.includes(currentUser.userId) ? (
                                <TiArrowUpThick className='sm:text-[24px] text-[20px] text-[green]' />
                              ) : (
                                <TiArrowUpOutline className='sm:text-[24px] text-[20px] text-[#5c5c5c]' />
                              )}
                              {item?.likeList?.length || 0}
                            </button>
                            <button
                              className='flex sm:gap-[16px] gap-[6px] text-[16px] items-center'
                              // onClick={() => {
                              //   setTweet(true);
                              //   setPostId(item?.id);
                              // }}
                            >
                              <MdMessage className='sm:text-[24px] text-[20px] text-[#5c5c5c]' />

                              {item?.commentCount || 0}
                            </button>

                            <button className='flex sm:gap-[16px] gap-[6px] text-[16px] items-center'>
                              <HiEye className='sm:text-[24px] text-[20px] text-[#5c5c5c]' />
                              {item?.viewsList?.length * 3}
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
                      <p className='text-[12px] text-gray-500 whitespace-nowrap sm:mt-0 mt-2 sm:block hidden'>
                        {formatTimeDifference(item?.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <Loader />
        )}
      </div>

      <ImageViewer
        imageViewer={imageViewer}
        setImageViewer={setImageViewer}
        postData={singlePost}
        setPostData={setSinglePost}
        handleLike={handleLike}
      />
      {/*<ReplyTweet tweet={tweet} setTweet={setTweet} postId={postId} />*/}
      <SinglePost
        post={post}
        setPost={setPost}
        postData={singlePost}
        setPostData={setSinglePost}
        handleLike={handleLike}
      />
      {userData.followers > 0 && (
        <Followers
          followers={followers}
          setFollowers={setFollowers}
          followerUsers={followerUsers}
          setFollowerUsers={setFollowerUsers}
        />
      )}
      {userData.following > 0 && (
        <Following
          following={following}
          setFollowing={setFollowing}
          followingUsers={followingUsers}
          setFollowingUsers={setFollowingUsers}
        />
      )}
    </div>
  );
};

export default UserProfile;
