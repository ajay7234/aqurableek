import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoArrowBack, IoClose } from "react-icons/io5";
import Avtar from "../../assets/Images/user.png";
import { getCurrentUserData } from "../../helper/userProfileData";
import { toggleFollowUser } from "../../helper/userFollowList";
import { useNavigate } from "react-router-dom";

const Following = ({
  following,
  setFollowing,
  followingUsers,
  setFollowingUsers,
}) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const currentUserData = async () => {
    const data = await getCurrentUserData();
    setUserData(data);
  };
  useEffect(() => {
    currentUserData();
  }, []);

  const handleUpdateFollowList = async (targetUserId) => {
    await toggleFollowUser(userData.userId, targetUserId);

    const updatedFollowerUsers = followingUsers.map((user) => {
      if (user.userId === targetUserId) {
        return {
          ...user,
          followerList: user.followerList.includes(userData.userId)
            ? user.followerList.filter((id) => id !== userData.userId) // Unfollow
            : [...user.followerList, userData.userId], // Follow
        };
      }
      return user;
    });

    setFollowingUsers(updatedFollowerUsers);
  };

  const handleNavigate = (item) => {
    setFollowing(!following);
    if (item.userId === userData.userId) {
      navigate("/profile");
    } else {
      navigate("/user-profile/" + item.userId, { replace: true });
    }
  };
  return (
    <div>
      <div>
        <Transition.Root show={following} as={Fragment}>
          <Dialog as="div" className="relative z-[999]" onClose={setFollowing}>
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

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                  <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all w-full sm:max-w-[560px]  max-h-[calc(100vh-207px)] overflow-auto custom-scroll">
                    <div className="flex justify-between p-[18px] pb-[12px] border-b-[1px] border-b-[#aaa] sticky top-0 bg-white">
                      <div className="flex items-center gap-2">
                        <IoArrowBack className="text-[#EF9595] text-[24px]" />
                        <h2 className="text-[20px] text-[#212121] font-light">
                          Following
                        </h2>
                      </div>
                      <button
                        onClick={() => setFollowing(false)}
                        className="text-[#ef9595] text-[24px]"
                      >
                        <IoClose />
                      </button>
                    </div>
                    {followingUsers?.map((item, i) => {
                      return (
                        <div key={i}>
                          <div className="sm:px-[20px] px-[12px] py-[14px] border-b-[1px] border-b-[#212121] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                onClick={() => handleNavigate(item)}
                                src={item.profilePic || Avtar}
                                alt="Avtar"
                                className="sm:w-[50px] w-[40px] sm:h-[50px] h-[40px] rounded-full object-cover"
                              />
                              <div>
                                <h2 className="text-[18px] font-semibold">
                                  {item.displayName}
                                </h2>
                                <p className="text-[#5c5c5c] font-medium sm:text-[14px] text-[12px]">
                                  {item.userName}
                                </p>
                              </div>
                            </div>
                            {item.userId !== userData.userId && (
                              <div>
                                {item?.followerList?.includes(
                                  userData.userId
                                ) ? (
                                  <button
                                    className="bg-[#ef9595] text-[#fff] rounded-[30px] font-semibold sm:text-[16px] text-[14px]
                                   p-[4px_14px]"
                                    onClick={() =>
                                      handleUpdateFollowList(item.userId)
                                    }
                                  >
                                    Following
                                  </button>
                                ) : (
                                  <button
                                    className="border-[#ef9595] text-[#ef9595] border-[1.5px] rounded-[30px] font-semibold sm:text-[16px] text-[14px]
                                     p-[4px_14px]"
                                    onClick={() =>
                                      handleUpdateFollowList(item.userId)
                                    }
                                  >
                                    Follow
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
};

export default Following;
