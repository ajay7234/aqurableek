import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Avatar from "../../assets/Images/user.png";
import { FaRegBookmark, FaRegUser } from "react-icons/fa6";
import { RiFileList2Line, RiQrCodeLine } from "react-icons/ri";
import { BsCalendar3, BsLightning } from "react-icons/bs";
import { IoHomeOutline, IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import moment from "moment";
import Followers from "../Modals/Followers";
import Following from "../Modals/Following";
import {
  findFollowerList,
  findFollowingList,
} from "../../helper/userFollowList";
import { fetchCollectionData, logout } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [followers, setFollowers] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const userProfile = useSelector((state) => state.user.userData);
  const location = useLocation();
  const authToken = localStorage.getItem("AuthToken");

  useEffect(() => {
    if (authToken) {
      if (!user) {
        dispatch(fetchCollectionData());
      }
    }
  }, [user?.userData, authToken]);

  useEffect(() => {
    if (userProfile) {
      setUserData(userProfile);
    }
  }, [userProfile]);

  const handleLogOut = () => {
    dispatch(logout());
    localStorage.removeItem("AuthToken");
    auth
      .signOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const body = document.querySelector("body");
    if (
      (location.pathname === "/" ||
        location.pathname === "/signup" ||
        location.pathname === "/forget") &&
      !authToken
    ) {
      body.classList.add("hide-sidebar");
    } else {
      body.classList.remove("hide-sidebar");
    }
  }, [location, authToken]);

  const fetchFollowersList = async () => {
    const followerData = await findFollowerList(userData.followerList);
    setFollowerUsers(followerData);

    const followingData = await findFollowingList(userData.followingList);
    setFollowingUsers(followingData);
  };

  useEffect(() => {
    fetchFollowersList();
  }, [userData]);

  const handleToggleSidebar = () => {
    const body = document.querySelector("body");
    body.classList.toggle("toggle-sidebar");
  };

  return (
    <>
      <div className='sidebar-main'>
        <Transition.Root show={mobileSidebar} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-50 lg:hidden'
            onClose={setMobileSidebar}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-900/80 opacity-[.5]' />
            </Transition.Child>

            <div className='fixed inset-0 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute right-0 top-0 flex w-16 justify-center pt-5'>
                      <button
                        type='button'
                        className='-m-2.5 p-2.5'
                        onClick={() => setMobileSidebar(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <MdOutlineClose
                          className='h-6 w-6 text-black'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='flex grow flex-col overflow-y-auto bg-[#fff] shadow-xl justify-between'>
                    <div>
                      <div className='mt-[20px] px-[20px] border-b-[#626161] border-b-[1px] pb-[20px]'>
                        <Link to={"/profile"}>
                          <img
                            className='w-[60px]'
                            src={userData?.profilePic || Avatar}
                            alt='Your Company'
                          />
                        </Link>
                        <div className='mt-[12px]'>
                          <p className='text-[18px] font-bold'>
                            {userData?.displayName}
                          </p>
                          <p className=' text-[14px]'>
                            {userData?.userName || "@johndeo28842"}
                          </p>
                        </div>
                        <div className='flex items-center gap-[12px]'>
                          <BsCalendar3 className='text-[#626161] text-[14px]' />
                          <p className='text-[#626161] text-[14px]'>
                            Joined{" "}
                            {moment(userData?.createdAt).format("MMMM YYYY")}
                          </p>
                        </div>
                        <div className='flex gap-[30px] mt-4'>
                          <div
                            className='flex gap-2'
                            onClick={() => setFollowers(!followers)}
                          >
                            <h2>{userData?.followerList?.length || 0}</h2>
                            <button className='text-[#626161]'>Follwers</button>
                          </div>
                          <div
                            className='flex gap-2'
                            onClick={() => setFollowing(!following)}
                          >
                            <h2>{userData?.followingList?.length || 0}</h2>
                            <button className='text-[#626161]'>
                              Following
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='mt-[10px] border-b-[#626161] border-b-[1px] pb-[10px]'>
                        <Link
                          to={"/dashboard"}
                          className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'
                        >
                          <IoHomeOutline className='text-[#979797] text-[20px] w-[22px]' />
                          <p className='text-[#212121] text-[18px]'>Home</p>
                        </Link>
                        <Link
                          to={"/profile"}
                          className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] '
                        >
                          <FaRegUser className='text-[#979797] text-[20px] w-[22px]' />
                          <p className='text-[#212121] text-[18px]'>Profile</p>
                        </Link>
                        <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer opacity-40'>
                          <FaRegBookmark className='text-[#979797] text-[20px] w-[22px]' />
                          <p className='text-[#212121] text-[18px]'>Bookmark</p>
                        </div>
                        <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer opacity-40'>
                          <RiFileList2Line className='text-[#979797] text-[22px] w-[22px]' />
                          <p className='text-[#212121] text-[18px]'>Lists</p>
                        </div>
                        <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer opacity-40'>
                          <BsLightning className='text-[#979797] text-[20px] w-[22px]' />
                          <p className='text-[#212121] text-[18px]'>Moments</p>
                        </div>
                      </div>
                      <div className='border-b-[#626161] border-b-[1px] py-[10px]'>
                        <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'>
                          <p className='text-[#212121] text-[18px]'>
                            Settings and privacy
                          </p>
                        </div>
                        <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'>
                          <p className='text-[#212121] text-[18px]'>
                            Help Center
                          </p>
                        </div>
                      </div>
                      <div className='py-[10px]' onClick={handleLogOut}>
                        <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'>
                          <p className='text-[#212121] text-[18px]'>Logout</p>
                        </div>
                      </div>
                    </div>
                    <div className='border-t-[#626161] border-t-[1px] py-[10px] flex justify-between items-center px-[20px]'>
                      <HiOutlineLightBulb className='text-[26px] text-[#EF9595] cursor-pointer' />
                      <RiQrCodeLine className='text-[26px] text-[#EF9595] cursor-pointer' />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        {!sidebarOpen && (
          <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
            <div className='flex grow flex-col overflow-y-auto bg-[#fff] shadow-xl justify-between'>
              <div>
                <div className='mt-[20px] px-[20px] border-b-[#626161] border-b-[1px] pb-[20px]'>
                  <Link to={"/profile"}>
                    <img
                      className='w-[60px] h-[60px] rounded-full object-cover'
                      src={userData?.profilePic || Avatar}
                      alt='Your Company'
                    />
                  </Link>
                  <div className='mt-[12px]'>
                    <p className='text-[18px] font-bold'>
                      {userData?.displayName}
                    </p>
                    <p className=' text-[14px]'>
                      {userData?.userName || "@johndeo28842"}
                    </p>
                  </div>
                  <div className='mt-[20px]'>
                    <div className='flex items-center gap-[12px]'>
                      <BsCalendar3 className='text-[#626161] text-[14px]' />
                      <p className='text-[#626161] text-[14px]'>
                        Joined {moment(userData?.createdAt).format("MMMM YYYY")}
                      </p>
                    </div>
                    <div className='flex gap-[30px] mt-4'>
                      <div
                        className='flex gap-2'
                        onClick={() => setFollowers(!followers)}
                      >
                        <h2>{userData?.followerList?.length || 0}</h2>
                        <button className='text-[#626161]'>Follwers</button>
                      </div>
                      <div
                        className='flex gap-2'
                        onClick={() => setFollowing(!following)}
                      >
                        <h2>{userData?.followingList?.length || 0}</h2>
                        <button className='text-[#626161]'>Following</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-[10px] border-b-[#626161] border-b-[1px] pb-[10px]'>
                  <Link
                    to={"/dashboard"}
                    className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'
                  >
                    <IoHomeOutline className='text-[#979797] text-[20px] w-[22px]' />
                    <p className='text-[#212121] text-[18px]'>Home</p>
                  </Link>
                  <Link
                    to={"/profile"}
                    className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'
                  >
                    <FaRegUser className='text-[#979797] text-[20px] w-[22px]' />
                    <p className='text-[#212121] text-[18px]'>Profile</p>
                  </Link>
                  <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer opacity-40'>
                    <FaRegBookmark className='text-[#979797] text-[20px] w-[22px]' />
                    <p className='text-[#212121] text-[18px]'>Bookmark</p>
                  </div>
                  <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer opacity-40'>
                    <RiFileList2Line className='text-[#979797] text-[22px] w-[22px]' />
                    <p className='text-[#212121] text-[18px]'>Lists</p>
                  </div>
                  <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer opacity-40'>
                    <BsLightning className='text-[#979797] text-[20px] w-[22px]' />
                    <p className='text-[#212121] text-[18px]'>Moments</p>
                  </div>
                </div>
                <div className='border-b-[#626161] border-b-[1px] py-[10px]'>
                  <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'>
                    <p className='text-[#212121] text-[18px]'>
                      Settings and privacy
                    </p>
                  </div>
                  <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'>
                    <p className='text-[#212121] text-[18px]'>Help Center</p>
                  </div>
                </div>
                <div className='py-[10px]' onClick={handleLogOut}>
                  <div className='p-[14px_20px] flex gap-[20px] items-center bg-white hover:bg-[#e3e3e3] cursor-pointer'>
                    <p className='text-[#212121] text-[18px]'>Logout</p>
                  </div>
                </div>
              </div>
              <div className='border-t-[#626161] border-t-[1px] py-[10px] flex justify-between items-center px-[20px]'>
                <HiOutlineLightBulb className='text-[26px] text-[#EF9595] cursor-pointer' />
                <RiQrCodeLine className='text-[26px] text-[#EF9595] cursor-pointer' />
              </div>
            </div>
          </div>
        )}

        <div className={!sidebarOpen ? "lg:pl-72" : ""}>
          <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 justify-between'>
            <div>
              <button
                type='button'
                id='clickButton'
                className='-m-2.5 p-2.5 text-gray-700 lg:block hidden'
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                  handleToggleSidebar();
                }}
              >
                <span className='sr-only'>Open sidebar</span>
                <FiMenu className='h-6 w-6' aria-hidden='true' />
              </button>
              <button
                type='button'
                className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
                onClick={() => setMobileSidebar(!mobileSidebar)}
              >
                <span className='sr-only'>Open sidebar</span>
                <FiMenu className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='flex justify-end'>
              <button className='text-[22px] text-[#626161]'>
                <IoNotificationsOutline />
              </button>
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}
