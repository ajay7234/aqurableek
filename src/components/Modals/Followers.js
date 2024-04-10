import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoArrowBack, IoClose } from "react-icons/io5";
import Avtar from "../../assets/Images/user.png";
import { toggleFollowUser } from "../../helper/userFollowList";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, toggleFollowingStatus } from "../../redux/userSlice";

const Followers = ({
  followers,
  setFollowers,
  followerUsers,
  setFollowerUsers,
}) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  const currentUserData = async () => {
    setUserData(user.userData);
  };
  useEffect(() => {
    if (user) {
      currentUserData();
    }
  }, [user]);

  const handleUpdateFollowList = async (targetUserId) => {
    await toggleFollowUser(userData.userId, targetUserId);

    const updatedFollowerUsers = followerUsers.map((user) => {
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
    await dispatch(fetchUserData());
    setFollowerUsers(updatedFollowerUsers);
  };

  const handleNavigate = (item) => {
    setFollowers(!followers);
    if (item.userId === userData.userId) {
      navigate("/profile");
    } else {
      navigate("/user-profile/" + item.userId, { replace: true });
    }
  };

  return (
    <div>
      <Transition.Root show={followers} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={setFollowers}>
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
                <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all w-full sm:max-w-[560px] max-h-[calc(100vh-207px)] overflow-auto custom-scroll">
                  <div className="flex justify-between p-[18px] pb-[12px] border-b-[1px] bg-white border-b-[#aaa] sticky top-0">
                    <div className="flex items-center gap-2">
                      <IoArrowBack className="text-[#EF9595] text-[24px]" />
                      <h2 className="text-[20px] text-[#212121] font-light">
                        Followers
                      </h2>
                    </div>
                    <button
                      onClick={() => setFollowers(false)}
                      className="text-[#EF9595] text-[24px]"
                    >
                      <IoClose />
                    </button>
                  </div>
                  {followerUsers?.map((item, i) => {
                    return (
                      <div key={i}>
                        <div className="sm:px-[20px] px-[12px] py-[14px] border-b-[1px] border-b-[#212121] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              onClick={() => handleNavigate(item)}
                              src={item.profilePic || Avtar}
                              alt="Avtar"
                              className="sm:w-[50px] w-[40px] sm:h-[50px] h-[40px] rounded-full object-cover cursor-pointer"
                            />
                            <div>
                              <h2 className="text-[18px] font-semibold cursor-pointer">
                                {item.displayName}
                              </h2>
                              <p className="text-[#5c5c5c] font-medium text-[14px] cursor-pointer">
                                {item.userName}
                              </p>
                            </div>
                          </div>
                          {item.userId !== userData.userId && (
                            <div>
                              {item?.followerList?.includes(userData.userId) ? (
                                <button
                                  className="bg-[#ef9595] text-[#fff] rounded-[30px] font-semibold sm:text-[16px] text-[14px] p-[4px_14px]"
                                  onClick={() =>
                                    handleUpdateFollowList(item.userId)
                                  }
                                >
                                  Following
                                </button>
                              ) : (
                                <button
                                  className="border-[#ef9595] text-[#ef9595] border-[1.5px] rounded-[30px] font-semibold sm:text-[16px] text-[14px] p-[4px_14px]"
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
  );
};

export default Followers;
